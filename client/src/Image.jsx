import { UPLOADS_URL } from './config.js';

export default function Image({src,...rest}) {
  src = src && src.includes('https://')
    ? src
    : UPLOADS_URL + '/' + src;
  return (
    <img {...rest} src={src} alt={''} />
  );
}