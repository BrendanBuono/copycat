import Shopify, { ITheme, IAsset } from 'shopify-api-node';
import asyncForEach from '../utils';

async function move(toShop: Shopify, toShopTheme: ITheme, fromShop: Shopify, fromShopTheme: ITheme, key: string, retries: number = 5) {
    try {
        const value = await fromShop.asset.get(fromShopTheme.id, {
            "asset[key]": key,
            "theme_id": fromShopTheme.id
        });
        await toShop.asset.create(toShopTheme.id, {
            key,
            value: value.value
        });
    }
    catch (ex) {
        retries === 1 ? console.log(`Failed to move asset ${key} due to ${ex}`) :
            move(toShop, toShopTheme, fromShop, fromShopTheme, key, retries - 1);
    }
}
export default async function execute(toShop: Shopify, fromShop: Shopify) {
    const toShopTheme = (await toShop.theme.list()).find((item) => item.role === 'main');
    const fromShopTheme = (await fromShop.theme.list()).find((item) => item.role === 'main');
    if (!toShopTheme || !fromShopTheme) {
        throw new Error(`main theme not found on ${toShopTheme ? 'fromShop' : 'toShop'}`);
    }

    const info = (await fromShop.asset.list(fromShopTheme.id));
    await asyncForEach(info, async (data: IAsset) => {
        await move(toShop, toShopTheme, fromShop, fromShopTheme, data.key);
    });
}