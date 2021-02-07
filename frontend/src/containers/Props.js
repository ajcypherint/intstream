import * as reducers from '../reducers/'
import { getSources } from '../actions/sources'

export class Props {
  constructor (api, fields, heading, edituri) {
    this.api = api
    this.fields = fields
    this.heading = heading
    this.edituri = edituri
    this.mapDispatchToProps = this.mapDispatchToProps.bind(this)
    this.mapStateToProps = this.mapStateToProps.bind(this)
  }

  mapStateToProps (state) {
    return {
      sourcesList: reducers.getSources(state),
      sourcesLoading: reducers.getLoading(state),
      sourcesErrors: reducers.getErrors(state),
      fields: this.fields,
      heading: this.heading,
      totalCount: reducers.getTotalCount(state),
      edituri: this.edituri,
      next: reducers.getNextPage(state),
      previous: reducers.getPreviousPage(state)

    }
  }

  mapDispatchToProps (dispatch) {
    return {
      fetchSources: (params = undefined) => dispatch(getSources(this.api, params)),
      fetchSourcesFullUri: (url, params = undefined) => dispatch(getSources(url, params))
    }
  }
}
