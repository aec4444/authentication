export const API_CUSTOM_SCOPES: string[] = [
  'adm:roles',
  'adm:allsurveys',
  'ci:customerLotSize',
  'ci:surveys',
  'ci:defaultLotSize',
  'ci:addSurveyResult',
  'ci:submitImage',
  'sp:salesPerson'
];

export const API_GUARANTEEREGISTRATION_SCOPES = [
  'openid email',
  'contractor:contractoraddress',
  'contractor:contractorprofile',
  'contractor:getuser',
  'contractor:getusers',
  'attachments:getdocumentattachments',
  'attachments:deleteattachment',
  'attachments:getattachment',
  'attachments:uploadattachment',
  'collections:get',
  'collections:getall',
  'collections:getmetadata',
  'collections:post',
  'collections:put',
  'collections:submit',
  'collections:delete',
  'lookups:get',
  'lookups:getshared',
  'metadata:parse',
  'metadata:evaluate',
  'staticfiles:getmetadatafile',
  'savedforms:getsavedforms',
  'application:getapplicationcontext'
];

export const ROOF_PROJECT_SCOPES = [
  'rp:common:getallcountries',
  'rp:common:getallcountries',
  'rp:common:getalllookupitems',
  'rp:common:getallstatesbycountry',
  'rp:common:getallregionsbycountry',
  'rp:roofproject:isalive',
  'rp:roofproject:getimagebyid',
  'rp:roofproject:getimages',
  'rp:roofproject:getroofprojectbyid',
  'rp:roofproject:getroofprojects',
  'rp:roofproject:getroofprojectsbysearchcriteria',
  'rp:roofproject:removeimages',
  'rp:roofproject:saveproperty',
  'rp:roofproject:saveroofproject',
  'rp:roofproject:setasdisplayimage',
  'rp:roofproject:uploadimagetester',
  'rp:roofproject:uploadimage'
];
