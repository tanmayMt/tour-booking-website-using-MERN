import { getPhotoUrl } from './config.js';

export default function Image({ src, ...rest }) {
  return (
    <img {...rest} src={getPhotoUrl(src)} alt="" />
  );
}
