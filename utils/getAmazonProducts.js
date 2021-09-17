import {parse} from "node-html-parser"

// Available CORS Proxys
const CORS_PROXYS = [
  "https://bw02bws0ef23ewfbss-1.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-2.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-3.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-4.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-5.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-6.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-7.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-8.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-9.herokuapp.com/",
  "https://bw02bws0ef23ewfbss-10.herokuapp.com/"
]

// Available User Agents
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
  "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1"
]

export default async (searchTerm = "") => {
  const maxPaginationSearch = 1
  const products = []
  let startingPageNumber = 1
  let productASINs = []
  let corsNumber = 0

  // Load the Amazon page from the given searchTerm variable, then search throught the max amount of pagination pages
  for(startingPageNumber; startingPageNumber <= maxPaginationSearch; startingPageNumber++) {
    corsNumber < CORS_PROXYS.length - 1 ? corsNumber += 1 : corsNumber = 0

    // Recreate the search URL with a random CORS proxy on each loop
    const searchURL = CORS_PROXYS[corsNumber] + "https://amazon.com/s?" + new URLSearchParams({
      k: searchTerm,
      page: startingPageNumber
    })

    // Fetch the requested Amazon page
    await fetch(searchURL, randomHeader())
      .then(data => data.text())
      .then(data => {
        const fetchedHTML = parse(data)
        products.push(...fetchedHTML.querySelectorAll("[data-asin][data-index]"))
      })
  }

  productASINs = products.map(product => product._attrs["data-asin"]).filter(asin => asin !== "")

  // Send the string array of ASINs to be verified and filtered
  verifyProducts(productASINs)
}

const verifyProducts = async (productASINs = []) => {
  let products = []
  let requestDelay = 0
  let corsNumber = 0

  const searchPromises = productASINs.map(asin => {
    requestDelay += 1

    return new Promise(res => setTimeout(res, requestDelay * 1500))
      .then(() => {
        corsNumber < CORS_PROXYS.length - 1 ? corsNumber += 1 : corsNumber = 0
        const searchURL = CORS_PROXYS[corsNumber] + "https://amazon.com/dp/" + asin
        
        fetch(searchURL, randomHeader())
        .then(data => data.text())
        .then(data => {
          const fetchedHTML = parse(data)
          products.push(convertHTMLToObject(fetchedHTML))
        })
      })
  })

  await Promise.all(searchPromises)
    .then(() => {   
      console.log("Before Filters") 
      console.log(products)
      products = products
        .filter(prod => !prod.soldBy.includes("Amazon"))
        .filter(prod => prod.sellers.length > 0)
        .filter(prod => parseInt(prod.sellers.substring(
          prod.sellers.indexOf("(")+1,
          prod.sellers.lastIndexOf(")")
          )) > 2
        )
    })
    .then(() => {
      console.log("After Filters")
      console.log(products)
      addProductsToTable(products)
    })
}


const convertHTMLToObject = (html) => {
  const productFormatted = {
    img: "",
    name: "",
    price: "$0.00",
    link: "",
    soldBy: "",
    rank: "",
    asin: "",
    sellers: ""
  }

  // Image URLs
  try {
    productFormatted.img = html.querySelector("#landingImage")._attrs.src
  } catch(e) {
    console.error("Image Error: ", e.message)
  }

  // Product Name
  try {
    productFormatted.name = html.querySelector("#productTitle").innerHTML.replace(/\n/g, '').trim()
  } catch(e) {
    console.error("Name Error: ", e.message)
  }

  // Price
  try {
    productFormatted.price = html.querySelector("#price_inside_buybox").innerHTML.replace(/\n/g, '').trim()
  } catch(e) {
    console.error("Price Error: ", e.message)
  }

  // Product Page Link
  try {
    productFormatted.link = html.querySelector("link[rel='canonical'][href]").getAttribute("href")
  } catch(e) {
    console.error("Link Error: ", e.message)
  }

  // Product Seller
  try {
    // productFormatted.soldBy = html.querySelector(".tabular-buybox-text").structuredText.replace(/\n/g, '').trim()
    productFormatted.soldBy = html.querySelector("#sellerProfileTriggerId").structuredText.replace(/\n/g, '').trim()
  } catch(e) {
    console.error("Sold By Error: ", e.message)
  }

  // Product Ranking
  try {
    const rank = html.querySelector("#productDetails_detailBullets_sections1").childNodes
    productFormatted.rank = rank.filter(el => el.rawTagName === "tr").filter(el => el.structuredText.includes("Best Sellers Rank"))[0].structuredText.replace(/\n/g, '').trim()
  } catch(e) {
    console.error("Rank Error: ", e.message)
  }
    
  // ASIN
  try {
    productFormatted.asin = productFormatted.link.substring(productFormatted.link.indexOf("/dp/") + 4)
  } catch(e) {
    console.error("ASIN Error 1: ", e.message)
  }
  
  // Number of Sellers
  try {
    const sellers = html.querySelector(".olp-text-box").childNodes
    productFormatted.sellers = sellers.filter(el => el.innerText.includes("New ("))[0].innerText.replace(/\n/g, '').trim();
  } catch(e) {
    console.error("Sellers Error: ", e.message)
  }

  return(productFormatted)
}

const addProductsToTable = (products) => {
  let tableHTML = ""
  
  products.forEach(prod => (
    tableHTML += `<tr>
      <td>
        <img src="${prod.img}" />
      </td>
      <td>${prod.name}</td>
      <td>${prod.price}</td>
      <td>
        <a href="${prod.link}">Click Here</a>
      </td>
      <td>${prod.soldBy}</td>
      <td>${prod.rank}</td>
      <td>${prod.asin}</td>
      <td>${prod.sellers}</td>
    </tr>`
  ))

  document.querySelector(".table-products-body").innerHTML = tableHTML
}

const randomHeader = () => {
  const meta = {
    "user-agent": USER_AGENTS[randNumber(USER_AGENTS.length - 1)]
  }
  const headers = new Headers(meta)
  
  return { headers }
}

const randNumber = (max) => (Math.floor(Math.random() * max))