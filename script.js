const url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY"
let allNewsData;

function searchNews(searchTerm , articles){
    if(!searchTerm)
        return articles

    searchTerm = searchTerm.toLowerCase()
    return articles.filter(item=>{
        return(
            item.title?.toLowerCase().includes(searchTerm) || item.description?.toLowerCase().includes(searchTerm) || item.source.name?.toLowerCase().includes(searchTerm)
        )
    })
}

async function getNews()
{
    try
    {
        let response = await fetch(url)
        if(!response.ok)
            throw new Error("An HTTP Error Has Been Occured Wait for The Response of Try Again Later !")

        const data = await response.json()
        console.log("Articles:", data.articles);
        window.newsArticles = data.articles
        allNewsData = data.articles
        displayNews(data.articles) // function called
    }
    catch(error)
    {
        console.log(`Something Went Wrong ${error}`)
        window.alert(error)
    }
}

function displayNews(articles) // Array of Articles
{
    const newsContainer = document.querySelector('.news_container')
    newsContainer.innerHTML = "" // Container ko empty krdiya baki JS Dekh lega

    articles.forEach((item)=>{
        const newsCard = `
        <div class="news_card">
            <div class="news_img">
                <img src="${item.urlToImage || 'default-image.png'}" alt="News Images">
                <span class="category_tag">${item.source.name}</span>
            </div>
            <div class="news_details">
                <div class="news_source">
                    <span class="source"><img src="times.png" alt="">${item.source.name}</span>
                </div>
                <h3 class="news_title">${item.title}</h3>
                <p class="news_desc">${item.description || ''}</p>
                <div class="news_footer">
                    <a href="${item.url}" target="_blank" class="read_more">Read More</a>
                    <div class="share_icons">
                        <img src="share.png" alt="Share">
                        <img src="bookmark.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        `
        
        newsContainer.innerHTML += newsCard
        })
}

function getTimeAgo(dateString) {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const timeDiff = now - publishedDate;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours/24)} days ago`;
}
document.addEventListener('DOMContentLoaded', getNews);

// Theme switcher functionality
const themes = {
    light: {
        primary: '#E11D48',
        secondary: '#BE123C',
        background: '#FFF1F2',
        cardBg: '#ffffff',
        textPrimary: '#881337',
        textSecondary: '#9F1239'
    },
    dark: {
        primary: '#7E22CE',
        secondary: '#6B21A8',
        background: '#F3E8FF',
        cardBg: '#ffffff',
        textPrimary: '#581C87',
        textSecondary: '#6D28D9'
    }
};

function setTheme(themeName) {
    const root = document.documentElement;
    const theme = themes[themeName];
    
    Object.keys(theme).forEach(key => {
        root.style.setProperty(`--${key}`, theme[key]);
    });
}

// Reading time calculator
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Custom share functionality
function shareNews(newsData) {
    const shareData = {
        title: newsData.title,
        text: newsData.description,
        url: newsData.url
    };
    
    if (navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData);
    } else {
        showCustomShareModal(newsData);
    }
}

function saveForOffline(newsData) {
    if ('caches' in window) {
        caches.open('news-cache').then(cache => {
            cache.put(newsData.url, new Response(JSON.stringify(newsData)));
        });
    }
}

const translations = {
    hi: {
        readMore: 'पूरी खबर पढ़ें',
        share: 'शेयर करें',
        save: 'सेव करें',
        trending: 'ट्रेंडिंग',
        // Add more translations
    },
    en: {
        readMore: 'Read More',
        share: 'Share',
        save: 'Save',
        trending: 'Trending',
        // Add more translations
    }
};

async function transalateText(text) {
    try {
        const encodedText = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=hi&dt=t&q=${encodedText}`;
        
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text if translation fails
    }
}

async function displayNewsHindi(articles) {
    const newsContainer = document.querySelector('.news_container')
    newsContainer.innerHTML = ""

    for (const item of articles) {
        const translatedTitle = await transalateText(item.title)
        const translatedDesc = await transalateText(item.description || '')
        
        const newsCard = `
            <div class="news_card">
                <div class="news_img">
                    <img src="${item.urlToImage || 'default-image.png'}" alt="News Images">
                    <span class="category_tag">${item.source.name}</span>
                </div>
                <div class="news_details">
                    <div class="news_source">
                        <span class="source"><img src="times.png" alt="">${item.source.name}</span>
                    </div>
                    <h3 class="news_title">${translatedTitle}</h3>
                    <p class="news_desc">${translatedDesc}</p>
                    <div class="news_footer">
                        <a href="${item.url}" target="_blank" class="read_more">Read More</a>
                        <div class="share_icons">
                            <img src="share.png" alt="Share">
                            <img src="bookmark.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        `
        newsContainer.innerHTML += newsCard
    }
}

const languageConvert = document.querySelector('.lang_toggle')
let isEnglish = true
const language = document.querySelector('.lang_toggle span')

languageConvert.addEventListener('click', async () => {
    if(isEnglish) {
        await displayNewsHindi(allNewsData)
        isEnglish = false
        language.textContent = "English"
    } else {
        displayNews(allNewsData)
        isEnglish = true
        language.textContent = "हिंदी"
    }
})

document.addEventListener('DOMContentLoaded' ,()=>{
    getNews()

    const searchInput = document.querySelector('#searchInput')
    searchInput.addEventListener('input',(data)=>{
        const term = data.target.value
        const filtered = searchNews(term , window.newsArticles)
        displayNews(filtered)
    })
})