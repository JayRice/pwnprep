export interface TargetParams {
    target_host: string;
    user: string;
    username: string;
    password: string;
    password_list: string;
    ntlm_hash: string;
    domain: string;
    target_domain: string;
    wordlist: string;
    base_wordlist: string;
    output_wordlist: string;
    service: string;
    port: string;
    port_list: string;
    service_names: string;
    share: string;
    mount_point: string;
    domain_controller: string;
    payload_type: string;
    target_dc: string;
    remote_dc: string;
    community_string: string;
    community_list: string;
    exclusion_path: string;
    extension: string;
    lsass_pid: string;
    dump_path: string;
    dump_file: string;
    output_save_path: string;
    saved_sam_file: string;
    filename: string;
    destination_path: string;
    ext_list: string;
    db_ext_list: string;
    ext: string;
    pattern: string;
    search_patterns: string;
    search_string: string;
    script_name: string;
    script_args: string;
    decoy1: string;
    decoy2: string;
    decoy3: string;
    tgs_outfile: string;
    encoded_file: string;
    output_kirbi: string;
    john_input: string;
    hashcat_input: string;
    base64_blob: string;
    remote_forest: string;
    remote_credential: string;
    path: string;
    login_path: string;
    user_field: string;
    pass_field: string;
    failure_marker: string;
    url: string;
    param: string;
    post_data: string;
    request_file: string;
    method: string;
    data: string;
    prefix: string;
    suffix: string;
    database: string;
    table: string;
    columns: string;
    condition: string;
    csrf_token_param: string;
    data_with_token: string;
    local_file: string;
    remote_path: string;
    target_network: string;
    target_dns: string;
    target_url: string;
    backup_group: string;
    group_name: string;
    target_user: string;
    replication_account: string;
    session_name: string;

}
export interface Note {
    id: string;
    title: string;
    content: {
        id: string
        content: string;
        type: string;
    }[];
    labels: string[];
    createdAt: Date;
    status: string;
}


export interface Label {
    id: string;
    name: string;
    parentLabel: string | null;
    childLabels: string[];
    depth: number;
}

export interface Message  {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
    type:string;
}

export interface Conversation {
    messages: Message[];     // full conversation
    updatedAt: number;       // for sorting

}

export interface CustomParam {
    name: string;
    placeholder: string;
    value: string;
    id: string;
}

export interface Certification  {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
}
