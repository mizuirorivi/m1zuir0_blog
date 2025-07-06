import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/${post.lang}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${post.lang}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml', language = 'ja') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/${language}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${language === 'ja' ? 'ja-JP' : 'en-US'}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)

  // Generate RSS for each language
  for (const lang of ['ja', 'en']) {
    const langPosts = publishPosts.filter((post) => post.lang === lang)

    if (langPosts.length > 0) {
      // Main RSS feed for language
      const rss = generateRss(config, sortPosts(langPosts), `${lang}/${page}`, lang)
      const langDir = path.join(outputFolder, lang)
      mkdirSync(langDir, { recursive: true })
      writeFileSync(path.join(langDir, page), rss)

      // Tag-specific RSS feeds for language
      for (const tag of Object.keys(tagData)) {
        const filteredPosts = langPosts.filter(
          (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
        )
        if (filteredPosts.length > 0) {
          const tagRss = generateRss(config, filteredPosts, `${lang}/tags/${tag}/${page}`, lang)
          const tagPath = path.join(outputFolder, lang, 'tags', tag)
          mkdirSync(tagPath, { recursive: true })
          writeFileSync(path.join(tagPath, page), tagRss)
        }
      }
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss
