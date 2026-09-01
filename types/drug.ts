export interface OpenFdaSubObject {
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  substance_name?: string[];
  route?: string[];
  product_type?: string[];
}

export interface DrugLabel {
  id?: string;
  set_id?: string;
  active_ingredient?: string[];
  purpose?: string[];
  indications_and_usage?: string[];
  warnings?: string[];
  do_not_use?: string[];
  ask_doctor?: string[];
  ask_doctor_or_pharmacist?: string[];
  stop_use?: string[];
  pregnancy_or_breast_feeding?: string[];
  keep_out_of_reach_of_children?: string[];
  dosage_and_administration?: string[];
  inactive_ingredient?: string[];
  openfda?: OpenFdaSubObject;
}

export interface OpenFdaMeta {
  disclaimer?: string;
  terms?: string;
  license?: string;
  last_updated?: string;
  results?: {
    skip: number;
    limit: number;
    total: number;
  };
}

export interface OpenFdaResponse<T = DrugLabel> {
  meta?: OpenFdaMeta;
  results?: T[];
  error?: {
    code: string;
    message: string;
  };
}