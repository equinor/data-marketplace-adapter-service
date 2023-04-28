declare namespace Collibra {
  type ResourceType =
    | "View"
    | "Asset"
    | "Community"
    | "Domain"
    | "AssetType"
    | "DomainType"
    | "Status"
    | "User"
    | "ClassificationMatch"
    | "UserGroup"
    | "Attribute"
    | "StringAttribute"
    | "ScriptAttribute"
    | "BooleanAttribute"
    | "DateAttribute"
    | "NumericAttribute"
    | "SingleValueListAttribute"
    | "MultiValueListAttribute"
    | "Comment"
    | "Attachment"
    | "Responsibility"
    | "Workflow"
    | "Job"
    | "Relation"
    | "RelationType"
    | "ComplexRelation"
    | "ComplexRelationType"
    | "ArticulationRule"
    | "Assignment"
    | "Scope"
    | "RelationTrace"
    | "ValidationRule"
    | "DataQualityRule"
    | "DataQualityMetric"
    | "Address"
    | "InstantMessagingAccount"
    | "Email"
    | "PhoneNumber"
    | "Website"
    | "Activity"
    | "FormProperty"
    | "WorkflowTask"
    | "ActivityChange"
    | "WorkflowInstance"
    | "Role"
    | "AttributeType"
    | "BooleanAttributeType"
    | "DateAttributeType"
    | "DateTimeAttributeType"
    | "MultiValueListAttributeType"
    | "NumericAttributeType"
    | "ScriptAttributeType"
    | "SingleValueListAttributeType"
    | "StringAttributeType"
    | "ViewSharingRule"
    | "ViewAssignmentRule"
    | "JdbcDriverFile"
    | "JdbcDriver"
    | "JdbcIngestionProperties"
    | "CsvIngestionProperties"
    | "ExcelIngestionProperties"
    | "ConnectionStringParameter"
    | "AssignedCharacteristicType"
    | "Notification"
    | "Tag"
    | "ComplexRelationLegType"
    | "ComplexRelationAttributeType"
    | "ComplexRelationLeg"
    | "BaseDataType"
    | "AdvancedDataType"
    | "DiagramPicture"
    | "DiagramPictureSharingRule"
    | "DiagramPictureAssignmentRule"
    | "Rating"
    | "Classification"
    | "PhysicalDataConnector"
    | "Context"

  type ResourceReference = {
    id: string
    resourceType: ResourceType
  }

  type NamedResourceReference = ResourceReference & {
    name: string
  }

  type Resource = ResourceReference & {
    createdBy: string
    createdOn: number
    lastModifiedBy: string
    lastModifiedOn: number
    system: boolean
  }

  type NamedResource = Resource & {
    name?: string | null
  }

  export type Attribute = Resource & {
    asset: NamedResourceReference
    value: any
    type: NamedResourceReference
  }

  export type Asset = NamedResource & {
    displayName: string
    articulationScore: number
    excludedFromAutoHyperlinking: boolean
    domain: NamedResourceReference
    type: NamedResourceReference
    status: NamedResourceReference
    avgRating: number
    ratingsCount: number
  }

  export type Tag = NamedResource & {
    description: string
    assetsCount: string
  }

  export type OutputModuleResponse<T = unknown> = {
    view: T
  }
}
