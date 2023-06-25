### IMPORTANT: The sprites copyright belongs to the Tibia creator (CipSoft GmbH).

# Tibia Sprite Extractor

Simple tool (one short JavaScript only) for sprite ripping of the game Tibia.

Run it with: deno run --allow-read --allow-write tibia-extractor.js

The subfolder **sprites/** must exist.

You can install Deno here: https://deno.com/runtime

Adjust the variables *sprFile* and *outDir* if needed.

You find the Tibia.spr file here: https://github.com/JoanaBLate/1098extended/blob/master/dat%20and%20spr.zip

## \# JUST GIVE ME THE DAMN SPRITES \#

OK: https://github.com/JoanaBLate/tibia-sprite-extractor/blob/main/sprites.tar.gz

Note: those sprites are numbered ignoring the blank sprites; if you want the Tibia numbering you must run the extractor.

## Structure of the file Tibia.spr

([x] = Number of bytes)

#### General data:

[4] File Version

[4] Sprite Count

--- Now we have sets of 4-bytes that contains the offset for each sprite

[4] Contains the offset of the first sprite

[4] Contains the offset of the second sprite

[4] Contains the offset of the third sprite

--- This continues for each sprite (the number in Sprite Count)

--- After all the offsets comes the data for each sprite

#### Each sprite data:

--- Each sprite begins with the color for the transparent pixels (Tibia uses fuchsia: 255, 0, 255); we don't need this color

[1] Red value of the transparent color (255)

[1] Green value of the transparent color (0)

[1] Blue value of the transparent color (255)

[2] Total size of reamining data of the sprite

--- Then comes a *sequence of (variable size) data blocks*; below we see **one data block** (containing 3 colored pixels)

[2] Number of transparent pixels

[2] Number of colored pixels 

[1] Red value of the first colored pixel

[1] Green value of the first colored pixel

[1] Blue value of the first colored pixel

[1] Red value of the second colored pixel

[1] Green value of the second colored pixel

[1] Blue value of the second colored pixel

[1] Red value of the third colored pixel

[1] Green value of the third colored pixel

[1] Blue value of the third colored pixel

--- More data blocks come here

<HR>

Adapted from:

https://github.com/TibiaJS/sprites-extractor

https://github.com/EPuncker/1098extended

https://otland.net/threads/understanding-tibia-spr-file-format-from-tibia-7-4.261776/
