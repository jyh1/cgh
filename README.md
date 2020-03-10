# Generate Handwriting Documents

![image](img/example.png)

This repository contains an application for generating realistic handwriting documents.

## Not Just a Cursive Font
It is not just another cursive font. The goal is to generate documents with a more authenticate feeling. Each character will be rendered differently in the following ways:
1. Adjacent strokes of two characters will be bent and joined up if possible.
2. Random perturbation to make the same character look slightly different each time.
3. Continuous increase of thickness and slackness of the characters.
4. Random perturbation to make letters not always perfectly aligned.

## Implementation

### Font Format
The strokes of each character are described by a series of cubic Bezier curves, so they can be easily manipulated by changing their control points.

![](img/outline.png)

Each Bezier curve is called _segment_ and is the smallest unit during font rendering. A single stroke may be divided into  segments for a more accurate representation of its shape.

However, this representation lost the variation of stroke thickness, resulting in a very boring font style. When generating the font file, the starting and ending thickness of each segment is also recorded. During rendering, the thickness of each point in a segment is linearly interpolated from its two ends.

![](img/countour.png)