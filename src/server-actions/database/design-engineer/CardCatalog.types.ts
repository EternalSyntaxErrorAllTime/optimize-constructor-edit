/**
 * Тип данных бд таблицы CurrentCardCatalog
 */
export type TypeCardCatalog = {
  ID: number;
  prefixFactory_ID: number;
  itemType: string;
  name: string;
  description?: string;
  icon?: string;
  designEntityType: string;
  lastRecords: number; // - for old card catalog
};

export type TypeAllCardCatalog = {
  ID: number;
  prefixFactory: string;
  itemType: string;
  name: string;
  description?: string;
  icon?: string;
};

export type TypeSearchCardCatalog = TypeAllCardCatalog;

export type TypeDataCardCatalog = {
  ID: number;
  prefixFactory: string;
  itemType: string;
  cardName: string;
  description?: string;
  icon?: string;
};

export type TypeRecordsCardCatalog = {
  ID: number;
  itemSequence: string;
  suffix: string;
  nameDetail: string;
  nameUser: string;
  dateCreate: Date;
  comment: string;
};

export type TypeAddRecordCardCatalog = {
  status: boolean;
  message: string;
  data: {
    prefixFactory: string;
    name: string;
    itemType: number;
    itemSequence: string;
    suffix: string | null;
    comment: string | null;
  };
};

// params for functional

export type TypeParamsSearchCardCatalog = {
  mainSearch?: string | null;
  prefixFactory?: number | null;
  itemType?: string | null;
};

export type TypeParamForAddRecordCardCatalog = {
  CardCatalog_ID: number;
  suffix?: string | null;
  name: string;
  createBy_user_ID: number;
  comment?: string | null;
};
