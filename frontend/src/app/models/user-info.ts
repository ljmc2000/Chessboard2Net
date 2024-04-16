export interface UserInfo {
  user_id: string;
  username: string;
  unlocked_sets?: number[];
  profile_flags?: number;
  prefered_set?: number;
  favourite_colour?: number;
  current_gameid?: string;
  current_gametype?: string;
  hidden_profile?: boolean;
  logged_in?: boolean;
}
