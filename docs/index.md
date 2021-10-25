Welcome to Crowd Captions. This project was developed over the course of one semester during a Computer Science capstone project at the University of Auckland, New Zealand.

# Quick Links
 - [Project management board](https://skrrt-skrrt.notion.site/85524848f7ba48efb8597a03217c0332?v=ef166ebcb83d4e4cadb663dfee409e9a)
 - [Documentation & Installation instructions](#documentation)
 - [Technology Stack](#technology)

# Install the latest version

If you'd just like to give this project a go, click the download button above, unzip the folder, and follow [these](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/) instructions on how to install an unpacked Chrome Extention. **Note: This plugin from the download link above will only work on the following domain: [aucklandtest.au.panopto.com](https://aucklandtest.au.panopto.com/)**

----

# Documentation

This project is split up into two repositories. The frontend code, which is compiled down in to the chrome extention downloadable above, can be accessed [here](https://github.com/uoa-compsci399-s2-2021/crowd-captions). The backend code, which is hosted locally or on AWS, is available [here](https://github.com/uoa-compsci399-s2-2021/team10-backend). To learn more about the project, choose a codebase you would like to view documentation for.

<br/>
<br/>
<br/>

<div style="text-align: center;">
<a href="frontend/" class="btn btn-dark">View frontend documentation</a>
<a href="backend/" class="btn btn-dark">View backend documentation</a>
</div>

<br/>
<br/>

# Technologies

This site is generated using [GitHub Pages](https://pages.github.com/), which uses [Jekyll](https://jekyllrb.com/). The design of this site is adapted from [Cayman](https://github.com/pages-themes/cayman). The abstract design elemented are adapted from [Paaatterns](https://products.ls.graphics/paaatterns/).

## Frontend

Frontend uses [Vue.js](https://vuejs.org/), with the [Vue CLI](https://cli.vuejs.org/) and the [Vue Web Extention plugin](https://github.com/Kocal/vue-web-extension). This allows rapid development of the extention, with live reload and compilation as well as all the nice features of [Webpack](https://webpack.js.org/) and Vue.

[Axios](https://axios-http.com/) is used for interacting with the backend APIs, and [Vuex](https://vuex.vuejs.org/) is used to manage state within the UI. The codebase is linted using [ESLint](https://eslint.org/).

Building for release is managed automatically using [GitHub Actions](https://github.com/features/actions).

## Backend


<!-- 
## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/uoa-compsci399-s2-2021/crowd-captions/edit/main/docs/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/uoa-compsci399-s2-2021/crowd-captions/settings/pages). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out. -->
