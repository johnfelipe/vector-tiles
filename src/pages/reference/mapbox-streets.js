import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { createRedirect } from '../../components/create-redirect';
import { NEWEST_STREETS } from '../../constants.js';

export default createRedirect(
  prefixUrl(`/vector-tiles/reference/mapbox-streets-v${NEWEST_STREETS}/`)
);
