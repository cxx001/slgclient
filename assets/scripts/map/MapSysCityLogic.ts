import MapBaseLayerLogic from "./MapBaseLayerLogic";
import MapUtil from "./MapUtil";
import SysCityLogic from "./entries/SysCityLogic";
import { MapBuildData } from "./MapBuildProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapSysCityLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        cc.systemEvent.on("update_builds", this.onUpdateBuilds, this);
        cc.systemEvent.on("update_build", this.onUpdateBuild, this);
        cc.systemEvent.on("delete_build", this.onDeleteBuild, this);

    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateBuilds(areaIndex: number, addIds: number[], removeIds: number[], updateIds: number[]): void {
  
        if (this._itemMap.has(areaIndex)) {
            for (let i: number = 0; i < addIds.length; i++) {
                this.addItem(areaIndex, this._cmd.buildProxy.getBuild(addIds[i]));
            }
            for (let i: number = 0; i < removeIds.length; i++) {
                this.removeItem(areaIndex, removeIds[i]);
            }
            for (let i: number = 0; i < updateIds.length; i++) {
                this.updateItem(areaIndex, this._cmd.buildProxy.getBuild(updateIds[i]));
            }
        }
    }

    protected onUpdateBuild(data: MapBuildData): void {
        // console.log("update_build", data);
        let areaIndex: number = MapUtil.getAreaIdByCellPoint(data.x, data.y);
        this.addItem(areaIndex, data);
    }

    protected onDeleteBuild(id: number, x: number, y: number): void {
        console.log("onDeleteBuild");
        let areaIndex: number = MapUtil.getAreaIdByCellPoint(x, y);
        this.removeItem(areaIndex, id);
    }

    public setItemData(item: cc.Node, data: any): void {
        let cityData: MapBuildData = data as MapBuildData;
        let position: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(cityData.x, cityData.y));
        item.setPosition(position);
        item.getComponent(SysCityLogic).setCityData(cityData);
    }

    public getIdByData(data: any): number {
        return (data as MapBuildData).id;
    }
}