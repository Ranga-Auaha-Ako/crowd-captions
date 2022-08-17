Crowd Captions helps improve the accessibility of content for those who cannot listen to the audio, and provides valuable resources for revision. By having everything transcribed automatically, the goal is that students will learn to write notes which are not taken verbatim. This will help encourage better note-taking and information processing, providing a more efficient way to study.

# Read the user documentation

You can view the user-facing documenation and watch the introduction video here: [crowdcaptions.notion.site](https://crowdcaptions.notion.site/)

# Install the latest version

If you'd just like to give this project a go, you can install it from [bit.ly/crowdcaptions](https://bit.ly/crowdcaptions). **Note: This plugin from the download link above will only work on whitelisted courses within the University of Auckland domain: [auckland.au.panopto.com](https://auckland.au.panopto.com/)**. Currently, the following courses are part of the pilot for this tool:

- MECHENG 222
- ENGGEN 131
- BIOSCI 106
- BIOSCI 220

---

# Documentation

This project is split up into two repositories. The frontend code, which is compiled down in to the chrome extention downloadable above, can be accessed [here](https://github.com/Ranga-Auaha-Ako/crowd-captions). The backend code, which is hosted locally or on AWS, is available [here](https://github.com/Ranga-Auaha-Ako/crowd-captions-backend). To learn more about the project, choose a codebase you would like to view documentation for.

<br/>

<div style="text-align: center;">
<a href="frontend/" class="btn btn-dark">View frontend documentation</a>
<br/>
<a href="backend/" class="btn btn-dark">View backend documentation</a>
</div>

<br/>

# Technologies

This site is generated using [GitHub Pages](https://pages.github.com/), which uses [Jekyll](https://jekyllrb.com/). The design of this site is adapted from [Cayman](https://github.com/pages-themes/cayman). The abstract design elemented are adapted from [Paaatterns](https://products.ls.graphics/paaatterns/).

## Frontend

Frontend uses [Vue.js](https://vuejs.org/), with the [Vue CLI](https://cli.vuejs.org/) and the [Vue Web Extention plugin](https://vue-web-extension.netlify.app/). This allows rapid development of the extention, with live reload and compilation as well as all the nice features of [Webpack](https://webpack.js.org/) and Vue.

[Axios](https://axios-http.com/) is used for interacting with the backend APIs, and [Vuex](https://vuex.vuejs.org/) is used to manage state within the UI. The codebase is linted using [ESLint](https://eslint.org/).

Building for release is managed automatically using [GitHub Actions](https://github.com/features/actions).

## Backend

Backend uses [Express.js](http://expressjs.com) to connect the frontend with database and uses [Sequlize](https://sequelize.org) to access the database.
We also uses [Mocha.js](https://mochajs.org) for automation testing on both the program and the database.
Backend is running on [AWS](https://aws.amazon.com) server with [Docker](https://www.docker.com) to allow easy deploy and upgrade, stable running environment and quick access.

# Future work

### Moderation

- Have an administrative view with unique moderation features for lecturers and moderators
- Allow access to moderators to be able to view the entire caption transcript including the edits to flag and remove any incorrect or inappropriate caption edits
- Allow for the moderators to endorse a caption they found most accurate and give this caption edit a unique badge

### Displaying all caption edits

- Implementation of a scroll bar to show all caption edits and their votes

### Expanded customisation of the caption's view components

- Implement multiple views of the caption component
- Allow for different caption size, caption colour and caption background colour for greater accessability and customisation

### Display differences in caption edits

- Use a default colour scheme for the original captions
- Alternate colours of components for each caption edit
- Highlight words different from the original caption

### Technology

- Implementing webSocket technology for faster and more robust content delivery

# Acknowledgements

The Skrrt Skrrt team would like to thank Ranga Auaha Ako's outstanding support, especially Steve Leichtweis for identifying the requirements for this project. Many thanks to Gemma Sinclair for her insight into Panopto's rollout within the university and Andrew Cho for helping us implement this project within the university's processes. Finally, thank you to Asma for an excellent semester and for all of her support despite the onslaught of challenges that COVID has provided.

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
