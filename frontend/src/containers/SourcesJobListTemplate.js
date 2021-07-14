import { mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'

export default (ORDERSTARTCOL) =>
  (FIELDS) =>
    (HEADING) =>
      (EDITURI) =>
        (ADDURI) =>
          (JOB_API) =>
            connectFunc(mapStateToPropsFunc(ORDERSTARTCOL)(
              FIELDS)(
              HEADING)(
              EDITURI)(
              ADDURI)
            )(mapDispatchToPropsFunc(JOB_API))
