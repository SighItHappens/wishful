'use server'

import * as cheerio from 'cheerio';

export type ParsedProductData = {
  name: string;
  description: string;
  price: string;
  productUrl: string;
};

export async function parseProductUrl(url: string): Promise<ParsedProductData> {
  try {
    if (!url) {
      throw new Error('URL is required');
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const productData = {
      name: '',
      description: '',
      price: '',
      productUrl: url,
    };

    const skipWebsites = ["amazon", "etsy"]
    if (skipWebsites.some(website => hostname.includes(website))) {
      return productData;
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product page');
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const fullHtml =  $.html()

    if (hostname.includes('walmart')) {
      let description = ''
      try {
        const apiData = JSON.parse($('script[data-seo-id="schema-org-product"]').text());
        
        if (Array.isArray(apiData)) {
          description = apiData[0]['description'];
        } else {
          description = apiData['description'];
        }
      } catch (e) {
        console.log("Using manual unescaping fallback. Error: ", e);
      }

      productData.name = $('h1#main-title').text().trim();
      productData.price = $('[data-automation-id="product-price"]').text().trim().replace(/[^0-9.]/g, '');
      productData.description = description.split('<br>')[0];
    }
    else if (hostname.includes('target')) {
      const descriptionRegex = /\\\"downstream_description\\\"\s*:\s*\\\"(.*?)\\\"/;
      const priceRegex = /\\\"formatted_current_price\\\"\s*:\s*\\\"(\$[^"]+)\\\"/;

      productData.name = $('[data-test="product-title"]').text().trim();
      productData.description = extractDescription(fullHtml, descriptionRegex);      
      productData.price = extractPrice(fullHtml, priceRegex);
    }
    else if (hostname.includes('bestbuy')) {
      const descriptionRegex = /"description":\{"__typename":"ProductDescription","long":"((?:\\.|[^"\\])*)"/;
      
      productData.name = $('.h4').text().trim();
      productData.description = extractDescription(fullHtml, descriptionRegex);
      productData.price = $('.customer-price').text().trim().replace(/[^0-9.]/g, '');
    }
    else {
      // Generic extraction for other sites
      productData.name = $('meta[property="og:title"]').attr('content') || $('title').text().trim() || '';
      productData.description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
      
      const priceText = $('[class*="price"], [id*="price"], [data-price], .price').first().text().trim();
      if (priceText) {
        productData.price = priceText.replace(/[^0-9.]/g, '');
      }
    }
    
    return productData;
  } catch (error) {
    console.error('Error parsing product:', error);
    throw new Error('Failed to parse product information');
  }
}


function extractPrice(fullHtml: string, regextMatcher: RegExp): string {
  const priceMatch = fullHtml.match(regextMatcher);
  
  if (priceMatch && priceMatch[1]) {
    return priceMatch[1].replace(/[^0-9.]/g, '');
  }
  return '';
}

function extractDescription(fullHtml: string, regextMatcher: RegExp): string {
  const descriptionMatch = fullHtml.match(regextMatcher);

  if (descriptionMatch && descriptionMatch[1]) {
    const capturedString = descriptionMatch[1]

    let description: string = '';
    try {
      description = JSON.parse(`"${capturedString.replace(/\\\\"/g, '\\"')}"`);
    } catch (e) {
      console.error("Failed to unescape the description string using JSON.parse:", e);
      description = parseEscapeCharacters(capturedString)
    }

    return description.split('\\n')[0]
  }

  return '';
}

function parseEscapeCharacters(text: string): string {
  console.log(Buffer.from(text).toString("ascii"));
  return text.replace(/\\"/g, '"')  // Unescape double quotes
  .replace(/\\\\/g, '\\') // Unescape backslashes
  .replace(/\\n/g, '\n') // Unescape newlines
  .replace(/\\r/g, '\r') // Unescape carriage returns
  .replace(/\\t/g, '\t') // Unescape tabs
  .replace(/\\b/g, '\b') // Unescape backspaces
  .replace(/\\f/g, '\f') // Unescape form feeds
  .replace(/\\u0026/g, '&') // Handles \u0026 -> & (Ampersand)
  .replace(/\\u003C/g, '<') // Handles \u003C -> < (Less than)
  .replace(/\\u003E/g, '>') // Handles \u003E -> > (Greater than)
  .replace(/\\u00A0/g, '\u00A0') // Handles \u00A0 -> Non-breaking space
  .replace(/\\u2018/g, '‘') // Handles \u2018 -> Left single quote
  .replace(/\\u2019/g, '’') // Handles \u2019 -> Right single quote (apostrophe)
  .replace(/\\u201C/g, '“') // Handles \u201C -> Left double quote
  .replace(/\\u201D/g, '”') // Handles \u201D -> Right double quote
  .replace(/\\u2013/g, '–') // Handles \u2013 -> En dash
  .replace(/\\u2014/g, '—'); // Handles \u2014 -> Em dash
}
