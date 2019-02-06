import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { createRedirect } from '../../components/create-redirect';
import { NEWEST_EB } from '../../constants.js';

export default createRedirect(
  prefixUrl(`/vector-tiles/reference/enterprise-boundaries-v${NEWEST_EB}/`)
);
