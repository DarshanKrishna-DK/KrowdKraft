const SHARE_CRAWLER =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|Pinterestbot|redditbot|Embedly|Iframely|vkShare|Quora Link Preview/i;

export function isShareCrawlerUa(userAgent: string) {
  return SHARE_CRAWLER.test(userAgent);
}
