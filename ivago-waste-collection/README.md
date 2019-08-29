# Ivago Waste Collection

Scrapes the Ivago website for the next collection round and outputs it as friendly JSON for you to consume.

```json
{
  "nextCollectionDate": "dinsdag, 3 september",
  "images": {
    "rest": "https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-REST.jpg",
    "pmd": "https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-PMD.jpg",
    "papier": "https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-PAPIER.jpg",
    "gft": "https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-GFT.jpg",
    "glas": "https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-GLAS.jpg"
  },
  "gft": true,
  "glas": true,
  "papier": true,
  "rest": true,
  "pmd": false
}
```

## Getting Started

Go to the [calendar page of Ivago's website](https://ivago.be/thuisafval/ophaling/ophaalkalender), fill in your address. You will see the area code for your calendar in both the URL and on the page itself.

Provide this area code as the subpath to the API url.

### Running

```shell
$ npm i
$ npm start
$ curl http://localhost:3000/:areaCode # e.g /Z2B
```

### Deploying

```shell
# Login to AWS (or skip this step if you have configured before)
$ sls config credentials --provider aws --key "..." --secret "..."
$ npm run deploy
```
