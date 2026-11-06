# Green Link Sourcing: Campaign Page

A single-page marketing site for social media campaigns. It links to the main website at https://greenlinksourcing.netlify.app.

## Files

- `index.html`: the campaign page
- `css/styles.css`: base styles (shared with the main site)
- `css/campaign.css`: campaign page styles
- `js/campaign.js`: WhatsApp links, campaign tracking, event preselection and form submission
- `images/`: hero photo and favicon
- `netlify.toml`: publish settings (no build step)

## Before you publish

1. Replace `YOUR-MARKETING-SITE` in `index.html` with your Netlify site name (in the canonical link, Open Graph URL and image).
2. Replace `234XXXXXXXXXX` in `index.html` and `js/campaign.js` with the WhatsApp number (international format, no `+`).
3. Replace the event dates `[Date to confirm]` once they're set.

## Deploy

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site** → **Import an existing project**, and select this repository. Leave build settings empty.
3. In **Forms**, turn on form notifications for `campaign-quote`.

## Share links

Add campaign tags to each post link so you can see which post brought each lead:

`https://YOUR-MARKETING-SITE.netlify.app/?utm_source=instagram&utm_campaign=lagos-qa`

The form stores `source`, `medium` and `campaign` with each enquiry.

## Notes

- The hero image is illustrative. Check that the embossed text on the bags isn't a real brand mark before posting.
- Demo website for educational purposes. All contact details and examples are fictional.
