import Shopify, { IPrivateShopifyConfig, ThemeRole, ITheme, IAsset } from 'shopify-api-node';
import config from './config.json';
import moveAssets from './movers/Assets'

async function main() {
    const toShop = new Shopify(config.toShop);
    const fromShop = new Shopify(config.fromShop);

    await moveAssets(toShop, fromShop);

}

(async () => {
    await main()
})();