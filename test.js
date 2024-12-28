const translate = require('google-translate-api-x');

async function translateText(text) {
    try {
        const res = await translate(text, { to: 'hi' });
        console.log(res.text); // Output the translated text
    } catch (error) {
        console.error('Translation error:', error);
    }
}

// Call the function with the text you want to translate
translateText("Hello world How are you");