export default {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['accessibility', 'best-practices', 'seo'],
    skipAudits: ['is-on-https'],
  },
};
