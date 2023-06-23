// MIT License
// Copyright (c) 2023 Joana Borges Late

"use strict"

// run it with: deno run --allow-read --allow-write tibia-extractor.js
// adjust the variables sprFile and outDir below if needed
// the Tibia.spr file is here: 
// https://github.com/JoanaBLate/1098extended/blob/master/dat%20and%20spr.zip

import fs from "node:fs"

import PNGImage from "npm:pngjs-image"

import BufferReader from "npm:buffer-reader"


const sprFile = "Tibia.spr" // You may change the file name

const outDir  = "sprites"  // You may change the output folder // DON'T WRITE SLASH OR BACKSLASH


const baseColor = { red: 255, green: 0, blue: 255, alpha: 255 }

const pathSeparator = Deno.cwd().includes("\\") ? "\\" : "/"

var reader

var numberOfSprites 

///////////////////////////////////////////////////////////////////////////////

function readingHandler(err, buffer) 
{
    if (err) { console.log("An error occurred while reading '" + sprFile + "'") ; return }

    reader = new BufferReader(buffer)
    
    const signature = reader.nextUInt32LE()
    
    numberOfSprites = reader.nextUInt16LE()

    console.log("Signature: ", signature)
    
    console.log("Number of Sprites: ", numberOfSprites, "including blanks")
    
    createSprite(0)
}

///////////////////////////////////////////////////////////////////////////////

function createSprite(n) 
{   
    const guide_index = 8 + (n * 4)
    
    reader.seek(guide_index)

    const address = reader.nextUInt32LE()
    
    if (address == 0) { createSprite(n + 1); return } // empty sprite
    
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
    
    image.writeImage(outDir + pathSeparator + n + ".png")
    
    if (n < numberOfSprites - 1) 
    { 
        setTimeout(function() { createSprite(n + 1) }, 0)
    }
}

///////////////////////////////////////////////////////////////////////////////

function main() 
{
    console.log("\nRunning Tibia Sprite Extractor\n")
    console.log("  In the currrent folder it expects to find:")
    console.log("    > file 'Tibia.spr'")
    console.log("    > EMPTY folder 'sprites'")
    console.log("  You can edit my code and change the names\n")
    console.log("  You can download 'Tibia.spr' here:")
    console.log("  https://github.com/JoanaBLate/1098extended/blob/master/dat%20and%20spr.zip\n")
    
    if (! check()) { console.log ("\nABORTING!"); return }
    
    console.log("  It takes a few minutes to finish\n")
    
    fs.readFile(sprFile, readingHandler) 
}

function check() 
{
    try 
    {
        if (! fs.existsSync(sprFile)) 
        {
            console.log("Cannot find file '" + sprFile + "'"); return false
        }
        if (! fs.existsSync(outDir)) 
        {
            console.log("Cannot find folder '" + outDir + "'"); return false
        }
        if (! fs.statSync(outDir).isDirectory())
        {
            console.log("'" + outDir + "' is not a folder"); return false        
        }
        const filenames = fs.readdirSync(outDir)
        if (filenames.length != 0)
        {
            console.log("'" + outDir + "' is not empty"); return false 
        }
    }
    catch (e)
    {
        console.log("An error occurred."); return false
    }
    return true
}

main()
