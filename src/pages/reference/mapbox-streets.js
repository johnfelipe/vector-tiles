import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { createRedirect } from '../../components/create-redirect';
import constants from '../../constants.json';

export default createRedirect(
  prefixUrl(
    `/vector-tiles/reference/mapbox-streets-v${constants.NEWEST_STREETS}/`
  )
);
