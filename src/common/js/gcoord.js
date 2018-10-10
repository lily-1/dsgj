import gcoord from 'gcoord';

export function mapbdtotx(lon, lat) {
    let result = gcoord.transform(
        [lon, lat], // 经纬度坐标
        gcoord.BD09, // 当前坐标系
        gcoord.GCJ02 // 目标坐标系
    );
    return result;
};
