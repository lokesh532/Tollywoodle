// https://developers.cloudflare.com/images/resizing-with-workers

export async function onRequest(context) {
    // Parse request URL to get access to query string
    let url = new URL(context.request.url)
  
    // Cloudflare-specific options are in the cf object.
    let options = { cf: { image: {} } }
  
    // Copy parameters from query string to request options.
    // You can implement various different parameters here.
    if (url.searchParams.has("fit")) options.cf.image.fit = url.searchParams.get("fit")
    if (url.searchParams.has("width")) options.cf.image.width = url.searchParams.get("width")
    if (url.searchParams.has("height")) options.cf.image.height = url.searchParams.get("height")
    if (url.searchParams.has("quality")) options.cf.image.quality = url.searchParams.get("quality")
    console.log('here')
    // Get URL of the original (full size) image to resize.
    // You could adjust the URL here, e.g., prefix it with a fixed address of your server,
    // so that user-visible URLs are shorter and cleaner.
    const imageURL = url.searchParams.get("image")
    if (!imageURL) return new Response('Missing "image" value', { status: 400 })
    
    // Build a request that passes through request headers,
    // so that automatic format negotiation can work.
    // const imageRequest = new Request(imageURL, {
    //   headers: request.headers
    // })
  
    // Returning fetch() with resizing options will pass through response with the resized image.
    return fetch(imageURL, options)
  }