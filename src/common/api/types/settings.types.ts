export type SettingsRequest = {
  [key: string]: string | number | null;
};

export type SettingsModel = {
  profile: {
    weight: number;
    weight_unit: string;
    height: number;
    height_unit: string;
    age: number;
    sex: 'male' | 'female';
    date_of_birth: string;
  } | null;
};
