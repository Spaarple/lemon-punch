import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Recuperer les donnees du formulaire
    const body = await request.json();
    const { prenom, email } = body;

    // Validation des donnees
    if (!prenom || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Le prénom et l\'email sont obligatoires'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation de la longueur
    if (prenom.length > 100) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Le prénom ne peut pas depasser 100 caracteres'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'L\'adresse email n\'est pas valide'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Recuperer les credentials depuis les variables d'environnement
    const GOOGLE_SHEET_ID = import.meta.env.GOOGLE_SHEET_ID;
    const GOOGLE_SERVICE_ACCOUNT_JSON = import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) {
      console.error('Variables d\'environnement manquantes');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Configuration serveur incorrecte'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parser les credentials du service account
    const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);

    // Authentification avec Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Preparer les donnees a inserer avec format de date compatible Google Sheets
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const values = [[prenom, email, currentDate]];

    // Ajouter la ligne dans le tableau du Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Feuille 1!A:C',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inscription reussie !'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur lors de l\'inscription a la newsletter:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Une erreur est survenue. Veuillez reessayer plus tard.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
