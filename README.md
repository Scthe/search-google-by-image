Use this script to search google by image and extract 'best guess' string. Useful if You want to f.e. categorize or mass rename files. Works awesome with art and posters.


## Usage

1. Install [Node.js](https://nodejs.org/download/)
2. Download this repo
3. Run `npm install`
4. `npm start IMAGES_DIRECTORY OUTPUT_FILE`

The script may take a while to execute. It does have to upload the images afterall.
Also both *IMAGES_DIRECTORY* *OUTPUT_FILE* **should not contain spaces**.

Use `npm run jshint` to run jshint or `npm test` to run tests.

#### Test problems

If You are using windows there may be some errors when trying to run tests. See this [issue](https://github.com/nathanboktae/mocha-casperjs/issues/25#issuecomment-94510576). You may also need to download [Phantomjs](http://phantomjs.org/download.html) separately and add it to Your PATH.

## Example output

After downloading this repo and running `npm install` execute `npm start test/data hello_images.json`. When it finishes open *hello_images.json* from the repo directory. It should look like this:

```
{
  "path": "test/data",
  "names": [
    {
      "path": "Mona_Lisa,_by_Leonardo_da_Vinci.jpg",
      "name": "leonardo da vinci mona lisa"
    }
  ]
}
```

Explanation:
* **path** - provided IMAGES_DIRECTORY
* **names** - list of results:
    * **path** - file's name
    * **name** - Google's best guess string

All You have to do now is to write a script that uses this JSON file.


## Disclaimer

Using this script may be against Google Terms of Service. Tread softly
