import {Model} from "../../model"
import * as p from "core/properties"
import * as hittest from "core/hittest"
import {isFunction} from "core/util/types"
import {Selection} from "../selections/selection"

export namespace DataSource {
  export interface Attrs extends Model.Attrs {
    selected: hittest.HitTestResult
    callback: any // XXX
  }

  export interface Opts extends Model.Opts {}
}

export interface DataSource extends DataSource.Attrs {}

export abstract class DataSource extends Model {

  constructor(attrs?: Partial<DataSource.Attrs>, opts?: DataSource.Opts) {
    super(attrs, opts)
  }

  static initClass() {
    this.prototype.type = "DataSource"

    this.define({
      selected: [ p.Instance                        ], // TODO (bev)
      callback: [ p.Any                             ], // TODO: p.Either(p.Instance(Callback), p.Function) ]
    })
  }

  initialize(): void {
    super.initialize()

    if (!this.selected) {
      this.selected = new Selection()
    }
  }

  connect_signals(): void {
    super.connect_signals()
    this.connect(this.properties.selected.change, () => {
      const {callback} = this
      if (callback != null) {
        if (isFunction(callback))
          callback(this)
        else
          callback.execute(this)
      }
    })
  }
}
DataSource.initClass()
