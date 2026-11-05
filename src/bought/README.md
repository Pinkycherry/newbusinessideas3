# Purchased page-template imports

Source repository: [Pinkycherry/staging](https://github.com/Pinkycherry/staging)

These are the purchased page snapshots transferred into the editable BusinessIdea.io project. The HTML is kept as source markup; the matching images, stylesheets, and scripts are kept under `public/bought/<folder>/`. The serving helper only namespaces local asset paths. It does not rewrite the original page content, branding, header, footer, or layout.

| Purchased source folder | Editable page source | Asset folder | Wired route |
|---|---|---|---|
| [Businessidea.io structure](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20structure) | [home.html](./home.html) | [home](../../public/bought/home/) | `/` |
| [Businessidea.io case-studies](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20case-studies) | [case-studies.html](./case-studies.html) | [case-studies](../../public/bought/case-studies/) | `/case-studies` |
| [Businessidea.io FAQ](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20FAQ) | [faq.html](./faq.html) | [faq](../../public/bought/faq/) | `/faq` |
| [Businessidea.io Lists structure](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20Lists%20structure) | [lists.html](./lists.html) | [lists](../../public/bought/lists/) | `/lists` |
| [Businessidea.io frameworks-comparison](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20frameworks-comparison) | [frameworks-comparison.html](./frameworks-comparison.html) | [frameworks-comparison](../../public/bought/frameworks-comparison/) | `/frameworks-comparison` |
| [Businessidea.io opensource research](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20opensource%20research) | [open-source.html](./open-source.html) | [open-source](../../public/bought/open-source/) | `/open-source` |
| [Businessidea.io research page structure](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20research%20page%20structure) | [research-1.html](./research-1.html) | [research-1](../../public/bought/research-1/) | `/market-research` |
| [Businessidea.io research page structure2](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20research%20page%20structure2) | [research-2.html](./research-2.html) | [research-2](../../public/bought/research-2/) | `/failed-startups/india` |
| [Businessidea.io sub category-pages-business-ideas](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20sub%20category-pages-business-ideas) | [subcategory-business-ideas.html](./subcategory-business-ideas.html) | [subcategory-business-ideas](../../public/bought/subcategory-business-ideas/) | `/lists/coaching-business-ideas` |
| [Businessidea.io templates](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20templates) | [templates.html](./templates.html) | [templates](../../public/bought/templates/) | `/templates` |
| [Businessidea.io tools](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20tools) | [tools.html](./tools.html) | [tools](../../public/bought/tools/) | `/tools` |
| [Businessidea.io topics templates](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20topics%20templates) | [topics.html](./topics.html) | [topics](../../public/bought/topics/) | `/topics` |
| [Businessidea.io-tools](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io-tools) | [tools-alternate.html](./tools-alternate.html) | [tools-alternate](../../public/bought/tools-alternate/) | `/tools/alternate` |
| [businessidea.io-startup-failure-database](https://github.com/Pinkycherry/staging/tree/main/businessidea.io-startup-failure-database) | [startup-failure-database.html](./startup-failure-database.html) | [startup-failure-database](../../public/bought/startup-failure-database/) | `/failed-startups` |

## Source folders with oversized HTML

- [Businessidea.io feature-matrix](https://github.com/Pinkycherry/staging/tree/main/Businessidea.io%20feature-matrix): its images, styles, and scripts were transferred to `public/bought/feature-matrix/`, but the source `index.html` is 1.1 MB and could not be retrieved through the connected GitHub file reader. It remains unchanged in the staging repository and is not yet wired to a route.
- [businessidea.io-startup-failure-database-full](https://github.com/Pinkycherry/staging/tree/main/businessidea.io-startup-failure-database-full): its available images, styles, and scripts were transferred to `public/bought/startup-failure-database-full/`, but the source `index.html` is 3.1 MB and could not be retrieved through the connected GitHub file reader. It remains unchanged in the staging repository. The smaller startup-failure database snapshot is wired at `/failed-startups`.

The purchased HTML snapshots contain the original seller branding and copy on purpose. Those are to be researched and edited in the later content/SEO/India-context pass, after the template transfer is complete.
