export const sanitizeHTML = (html: string) => {
  const tagsToStrip = ['script', 'style', 'iframe', 'object', 'embed'];
  let sanitized = html;
  tagsToStrip.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
    sanitized = sanitized.replace(regex, '');
  });
  return sanitized;
};