# Momementum Tech Task Exercise

An important data point for many of the companies we work with is are they currently using a competitor.

One of the companies more specifically wants to know is a company using Drift live chat or not.

In the project you'll find a data folder which contains 34 homepages of various companies, some use Drift some do not.

There is a draft endpoint here /chat/drift, please complete the endpoint to return an array of all the companies with a true/false of whether they are using Drift or not.

Be aware that depending on how the website has installed Drift the details you're looking for could be different.

Feels free to add packages to the project if required.

## Approach Explanation

Assumptions:

- Used provided data as the instructions said to use the data folder, therfore not used live data.

To approach this task, I started by exploring given html pages and looking for various ways that Drift live chat could be implemented on a site. I then cross referenced this with manually checking the live site to see if Drift was visible. I then tried to see if there were docs for Drift but looked like it was a closed product.

I saw a few different implementations in the HTML so started with parsing this with cheerio.
however after testing various selectors I discovered that there was one consistent and reliable way to determine if the site was using Drift.

the Drift javascript was being loaded from the same CDN endpoint, regardless of implementation. I have left the cheerio code commented out in the file for clarity.

The code could be much shorter but I have tried to make it as readable as possible & pulled things out into reusable functions as i would in a team dev environment.

I also changed the verb for the endpoint as it was just fetching data and no side effects took place.
