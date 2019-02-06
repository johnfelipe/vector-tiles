import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { createRedirect } from '../../components/create-redirect';
import { NEWEST_TERRAIN } from '../../constants.js';

export default createRedirect(
  prefixUrl(`/vector-tiles/reference/mapbox-terrain-v${NEWEST_TERRAIN}/`)
);
