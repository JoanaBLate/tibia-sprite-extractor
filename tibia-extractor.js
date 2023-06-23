
"use strict"

// run it with: deno run --allow-read --allow-write tibia-extractor.js
// adjust the variables sprFile and outDir below if needed

import fs from "node:fs"

import PNGImage from "npm:pngjs-image"

import BufferReader from "npm:buffer-reader"


const sprFile = "Tibia.spr" // You may change the file name

const outDir  = "sprites/"  // You may change the output folder


const baseColor = { red: 255, green: 0, blue: 255, alpha: 255 }

var reader

///////////////////////////////////////////////////////////////////////////////

function readingHandler(err, buffer) 
{
    if (err) { throw err }

    reader = new BufferReader(buffer)
    
    const info = {
        signature: reader.nextUInt32LE(),
        size: reader.nextUInt16LE()
    }

    console.log("Signature: " + info.signature)
    console.log("  Sprites: " + info.size)
    
    const off = info.size
    
    for (let n = 0; n < off; n++) { createSprite(n) }
}

///////////////////////////////////////////////////////////////////////////////

function createSprite(n) 
{   
  // console.log("creating sprite:", n)
    
    const guide_index = 8 + (n * 4)
    
    reader.seek(guide_index)

    const address = reader.nextUInt32LE()
    
    if (address == 0) { return } // empty sprite
    
    const image = PNGImage.createImage(32, 32)
    
    reader.seek(address)
    
    /* fucshia
    console.log(reader.nextUInt8()) // 255
    console.log(reader.nextUInt8()) //   0
    console.log(reader.nextUInt8()) // 255
    */
    
    reader.move(3) // Skipping base color (fucshia)
    
    const dataSize = reader.nextUInt16LE()

    const offset = reader.tell() + dataSize

    let currentPixel = 0

    const size = 32
    
    while (reader.tell() < offset) 
    {
        const transparentPixels = reader.nextUInt16LE()

        const coloredPixels = reader.nextUInt16LE()
        
        currentPixel += transparentPixels
        
        for (let i = 0; i < coloredPixels; i++) 
        {
            image.setPixel(
              parseInt(currentPixel % size),
              parseInt(currentPixel / size),
              { red:reader.nextUInt8(), green:reader.nextUInt8(), blue:reader.nextUInt8(), alpha:255 }
            )
            
            currentPixel++
        }
    }
    
    image.writeImage(outDir + n + ".png")
}

///////////////////////////////////////////////////////////////////////////////

function main() 
{
     fs.readFile(sprFile, readingHandler)
}

main()


