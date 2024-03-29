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

  export type AssetWithAttributes = Asset & {
    attributes: Attribute[]
  }

  export type Responsibility = Resource & {
    role: NamedResourceReference
    baseResource: ResourceReference
    owner: ResourceReference
  }

  type Email = Resource & {
    emailAddress: string
  }

  type PhoneNumber = Resource & {
    type: "FAX" | "MOBILE" | "OTHER" | "PAGER" | "PRIVATE" | "WORK"
    phoneNumber: string
  }

  type InstantMessagingAccount = Resource & {
    account: string
    type: "AOL" | "GTALK" | "ICQ" | "JABBER" | "LIVE_MESSENGER" | "SKYPE" | "YAHOO_MESSENGER"
  }

  type Website = Resource & {
    url: string
    type: "FACEBOOK" | "LINKEDIN" | "MYSPACE" | "TWITTER" | "WEBSITE"
  }

  type Address = Resource & {
    city: string
    street: string
    number: string
    state: string
    country: string
    postalCode: string
    type: "HOME" | "WORK"
  }

  export type User = Resource & {
    userName: string
    firstName: string
    lastName: string
    emailAddress: string
    gender: "MALE" | "FEMALE" | "UNKNOWN"
    language: string
    additionalEmailAddresses: Email[]
    phoneNumbers: PhoneNumber[]
    instantMessagingAccounts: InstantMessagingAccount[]
    websites: Website[]
    addresses: Address[]
    activated: boolean
    enabled: boolean
    ldapUser: boolean
    userSource: "INTERNAL" | "LDAP" | "SSO"
    guestUser: boolean
    apiUser: boolean
    licenseType: "CONSUMER" | "AUTHOR"
  }

  export type NavigationStatistic = {
    assetId: string
    name: string
    numberOfViews: number
    lastViewedDate: number
  }

  export type Community = Resource & {
    name: string
    description: string
  }

  export type Domain = NamedResource & {
    description: string
    type: NamedResourceReference
    community: NamedResourceReference
    excludedFromAutoHyperlinking: boolean
  }

  export type Status = NamedResource & {
    description: string
  }

  type SymbolData = {
    color: string
    symbolType: "NONE" | "ICON_CODE" | "ACRONYM_CODE"
    iconCode: string
    acronymCode: string
  }

  export type AssetType = NamedResource & {
    description: string
    parent: NamedResourceReference
    symbolData: SymbolData
    displayNameEnabled: boolean
    ratingEnabled: boolean
  }

  export type RelationType = Resource & {
    resourceType: ResourceType
    sourceType: NamedResourceReference
    targetType: NamedResourceReference
    role: string
    coRole: string
    description: string
  }

  export type Relation = Resource & {
    resourceType: ResourceType
    source: NamedResourceReference
    target: NamedResourceReference
    type: ResourceReference
    startingDate: number
    endingDate: number
  }

  export type Tag = NamedResource & {
    description: string
    assetsCount: string
  }

  export type StartWorkflowInstanceRequest = {
    workflowDefinitionId: string
    businessItemIds: string[]
    businessItemType: "ASSET" | "DOMAIN" | "COMMUNITY" | "GLOBAL"
    formProperties: Record<string, any>
    guestUserId: string
    sendNotification: boolean
  }

  type Permission =
    | "EDGE"
    | "EDGE_SITE_CONNECT"
    | "EDGE_SITE_MANAGE"
    | "EDGE_SITE_ADMINISTER"
    | "EDGE_INTEGRATION_CAPABILITY_MANAGE"
    | "EDGE_VIEW_CONNECTIONS_AND_CAPABILITIES"
    | "EDGE_VIEW_LOGS"
    | "ASSET_GRID_ADMINISTRATION"
    | "ATTACHMENT_ADD"
    | "ATTACHMENT_CHANGE"
    | "ATTACHMENT_REMOVE"
    | "COMMENT_ADD"
    | "COMMENT_CHANGE"
    | "COMMENT_REMOVE"
    | "RATING_ADD"
    | "RATING_CHANGE"
    | "RATING_REMOVE"
    | "COMMUNITY_ADD"
    | "COMMUNITY_CHANGE"
    | "COMMUNITY_REMOVE"
    | "COMMUNITY_CONFIGURE_EXTERNAL_SYSTEM"
    | "COMMUNITY_RESPONSIBILITY_ADD"
    | "COMMUNITY_RESPONSIBILITY_CHANGE"
    | "COMMUNITY_RESPONSIBILITY_REMOVE"
    | "DOMAIN_ADD"
    | "DOMAIN_CHANGE"
    | "DOMAIN_REMOVE"
    | "DOMAIN_RESPONSIBILITY_ADD"
    | "DOMAIN_RESPONSIBILITY_CHANGE"
    | "DOMAIN_RESPONSIBILITY_REMOVE"
    | "WORKFLOW_MANAGE"
    | "WORKFLOW_DESIGNER_ACCESS"
    | "ASSET_ADD"
    | "ASSET_CHANGE"
    | "ASSET_REMOVE"
    | "ASSET_STATUS_CHANGE"
    | "ASSET_TYPE_CHANGE"
    | "ASSET_TAG_CHANGE"
    | "ASSET_ATTRIBUTE_ADD"
    | "ASSET_ATTRIBUTE_CHANGE"
    | "ASSET_ATTRIBUTE_REMOVE"
    | "ASSET_RESPONSIBILITY_ADD"
    | "ASSET_RESPONSIBILITY_CHANGE"
    | "ASSET_RESPONSIBILITY_REMOVE"
    | "VIEW_PERMISSIONS_CHANGE"
    | "BUSINESS_SEMANTICS_GLOSSARY"
    | "REFERENCE_DATA_MANAGER"
    | "DATA_STEWARDSHIP_MANAGER"
    | "SYSTEM_ADMINISTRATION"
    | "USER_ADMINISTRATION"
    | "WORKFLOW_ADMINISTRATION"
    | "DATA_HELPDESK"
    | "POLICY_MANAGER"
    | "DATA_DICTIONARY"
    | "CATALOG"
    | "WORKFLOW_MANAGE_ALL"
    | "WORKFLOW_MESSAGE_EVENTS_USE"
    | "VIEW_PERMISSIONS_VIEW_ALL"
    | "VIEW_MANAGE"
    | "VIEW_SHARE"
    | "VIEW_MANAGE_ALL"
    | "ADVANCED_DATA_TYPE_ADD"
    | "ADVANCED_DATA_TYPE_EDIT"
    | "ADVANCED_DATA_TYPE_REMOVE"
    | "TAGS_VIEW"
    | "TAGS_MANAGE"
    | "VALIDATION_EXECUTION"
    | "ACCESS_DATA"
    | "VIEW_SAMPLES"
    | "RELATION_TYPE_ADD"
    | "RELATION_TYPE_REMOVE"
    | "RELATION_TYPE_CHANGE"
    | "REGISTER_PROFILING_INFORMATION"
    | "REPORTING_DOWNLOAD_INSIGHTS_DATA"
    | "REPORTING_VIEW_INSIGHTS_REPORTS"
    | "INSIGHTS_VIEW"
    | "TECHNICAL_LINEAGE"
    | "LOGS_VIEW"
    | "RESOURCE_MANAGE_ALL"
    | "CONFIGURATION_VIEW"
    | "CONFIGURATION_EDIT"
    | "BACKSTORE_VIEW"
    | "BACKSTORE_EDIT"
    | "ASSESSMENTS"
    | "METADATA_LAKE"

  type Role = NamedResource & {
    description: string
    permissions: Permission[]
    global: boolean
  }

  export type WorkflowDefinition = Resource & {
    name: string
    description: string
    processId: string
    startLabel: string
    formRequired: boolean
    startFormKeyAvailable: boolean
    startFormJsonModelAvailable: boolean
    enabled: boolean
    domainAssignmentRules: NamedResourceReference[]
    assetAssignmentRules: NamedResourceReference[]
    businessItemResourceType: "ASSET" | "DOMAIN" | "COMMUNITY" | "GLOBAL"
    exclusivity: "RESOURCE_EXCLUSIVITY" | "DEFINITION_EXCLUSIVITY" | "UNCONSTRAINED"
    guestUserAccessible: boolean
    registeredUserAccessible: boolean
    candidateUserCheckEnabled: boolean
    globalCreate: boolean
    startEvents:
      | "ASSET_ADDED"
      | "ASSET_REMOVED"
      | "ASSET_STATUS_CHANGED"
      | "ASSET_DOMAIN_CHANGED"
      | "ASSET_TYPE_CHANGED"
      | "ASSET_ATTRIBUTE_CHANGED"
      | "ASSET_NAME_CHANGED"
      | "ASSET_DISPLAY_NAME_CHANGED"
      | "ASSET_ATTRIBUTE_ADDED"
      | "ASSET_ATTRIBUTE_REMOVED"
      | "DOMAIN_ADDED"
      | "DOMAIN_REMOVED"
      | "ROLE_GRANTED"
      | "ROLE_REVOKED"
      | "WORKFLOW_STARTED"
      | "WORKFLOW_CANCELED"
      | "WORKLFLOW_ESCALATION"
      | "WORKFLOW_TASK_COMPLETED"
      | "USER_ADDED"
      | "USER_REMOVED"
      | "USER_DISABLED"
      | "COMMENT_ADDED"
      | "COMMENT_REMOVED"
      | "COMMENT_CHANGED"
      | "RELATION_ADDED_AND_ASSET_IS_SOURCE"
      | "RELATION_REMOVED_AND_ASSET_WAS_SOURCE"
      | "RELATION_ADDED_AND_ASSET_IS_TARGET"
      | "RELATION_REMOVED_AND_ASSET_WAS_TARGET"
      | "TAG_ASSIGN_CHANGED"
      | "CLASSIFICATION_MATCH_ACCEPTED"
      | "CLASSIFICATION_MATCH_REJECTED"
      | "CLASSIFICATION_MATCH_ADDED"
      | "CLASSIFICATION_MATCH_REMOVED"
      | "CLASSIFICATION_MATCH_UPDATED"
      | "DATABASE_REGISTRATION_COMPLETED"
      | "DATABASE_REGISTRATION_FAILED"
    configurationVariables: Record<string, string>
    startRoles: Role[]
    stopRoles: Role[]
    reassignRoles: Role[]
  }

  type WorkflowDefinitionReference = {
    id: string
    resourceType: ResourceType
    name: string
    processId: string
  }

  type OptionValue = {
    label: string
    value: string
  }

  type DropdownValue = {
    parents: string[]
    idAsString: string
    id: string
    text: string
  }

  type FormProperty = {
    id: string
    name: string
    type: string
    value: string
    writable: boolean
    required: boolean
    enumValues: DropdownValue[]
    checkButtons: OptionValue[]
    radioButtons: OptionValue[]
    defaultDropdownValues: DropdownValue[]
    proposedDropdownValues: DropdownValue[]
    dateTimeType: string
    multiValue: boolean
    proposedFixed: boolean
    defaultFromResource: boolean
    multiDefaultDropdownValues: Record<string, DropdownValue[]>
    multiProposedDropdownValues: Record<string, DropdownValue[]>
    assetType: ResourceReference
    communityIds: string[]
    domainIds: string[]
    statusIds: string[]
  }

  export type WorkflowTask = {
    id: string
    system: boolean
    resourceType: ResourceType
    workflowDefinition: WorkflowDefinitionReference
    workflowInstanceId: string
    key: string
    type: string
    aggregationKey: string
    priority: number
    owner: string
    candidateUsers: User[]
    createTime: number
    dueDate: number
    cancelable: boolean
    reassignable: boolean
    formRequired: boolean
    formKeyAvailable: boolean
    containsActivityStream: boolean
    inError: boolean
    errorMessage: string
    customButtons: FormProperty[]
    description: string
    title: string
    businessItem: ResourceReference
    businessItemReference: NamedResourceReference
  }

  type PagedQueryParams = Partial<{
    offset: number
    limit: number
    countLimit: number
  }>

  type NameableQueryParams = Partial<
    PagedQueryParams & {
      name: string
      nameMatchMode: "START" | "END" | "ANYWHERE" | "EXACT"
    }
  >

  type SortableQueryParams<F> = Partial<{
    sortField: F
    sortOrder: "ASC" | "DESC"
  }>

  export type AssetQueryParams = Partial<
    PagedQueryParams &
      NameableQueryParams &
      SortableQueryParams<"NAME" | "DISPLAY_NAME"> & {
        domainId: string
        communityId: string
        typeIds: string[]
        statusIds: string[]
        tagNames: string[]
        typeInheritance: boolean
        excludeMeta: boolean
      }
  >

  export interface PagedResponse<T = any> {
    total: number
    offset: number
    limit: number
    results: T[]
  }

  export type PagedAttributeResponse = PagedResponse<Attribute>
  export type PagedAssetResponse = PagedResponse<Asset>
  export type PagedResponsibilityResponse = PagedResponse<Responsibility>
  export type PagedUserResponse = PagedResponse<User>
  export type PagedNavigationStatisticResponse = PagedResponse<NavigationStatistic>
  export type PagedCommunityResponse = PagedResponse<Community>
  export type PagedWorkflowDefinitionResponse = PagedResponse<WorkflowDefinition>
  export type PagedDomainResponse = PagedResponse<Domain>
  export type PagedStatusResponse = PagedResponse<Status>
  export type PagedAssetTypeResponse = PagedResponse<AssetType>
  export type PagedRelationTypeResponse = PagedResponse<RelationType>
  export type PagedRelationResponse = PagedResponse<Relation> & {
    nextCursor: string
  }
  export type PagedTagResponse = PagedResponse<Tag>

  export type OutputModuleResponse<T = unknown> = {
    view: T
  }

  export type WorkflowInstance = Resource & {
    workflowDefinition: WorkflowDefinitionReference
    subInstances: any[]
    subProcessInstancesCount: number
    parentWorkflowInstanceId: string
    businessItem: ResourceReference
    tasks: WorkflowTask[]
    startDate: number
    ended: boolean
    createdAssetId: string
    inError: boolean
    errorMessage: string
  }
}
