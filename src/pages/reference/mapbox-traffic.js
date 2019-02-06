import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { createRedirect } from '../../components/create-redirect';
import { NEWEST_TRAFFIC } from '../../constants.js';

export default createRedirect(
  prefixUrl(`/vector-tiles/reference/mapbox-traffic-v${NEWEST_TRAFFIC}/`)
);
