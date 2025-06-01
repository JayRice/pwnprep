import { TargetParams } from '../data/interfaces.ts';

/**
 * List of all placeholder keys used in commands.
 * Add any new placeholder key here to have it automatically handled by replaceParams and revertParams.
 */
export const PLACEHOLDERS: Array<keyof TargetParams> = [
    'target_host',
    'user',
    'username',
    'password',
    'password_list',
    'ntlm_hash',
    'domain',
    'target_domain',
    'wordlist',
    'base_wordlist',
    'output_wordlist',
    'service',
    'port',
    'port_list',
    'payload_type',
    'service_names',
    'share',
    'mount_point',
    'domain_controller',
    'target_dc',
    'remote_dc',
    'community_string',
    'community_list',
    'exclusion_path',
    'extension',
    'lsass_pid',
    'dump_path',
    'dump_file',
    'output_save_path',
    'saved_sam_file',
    'filename',
    'destination_path',
    'ext_list',
    'db_ext_list',
    'ext',
    'pattern',
    'search_patterns',
    'search_string',
    'script_name',
    'script_args',
    'decoy1',
    'decoy2',
    'decoy3',
    'tgs_outfile',
    'encoded_file',
    'output_kirbi',
    'john_input',
    'hashcat_input',
    'base64_blob',
    'remote_forest',
    'remote_credential',
    'path',
    'login_path',
    'user_field',
    'pass_field',
    'failure_marker',
    'url',
    'param',
    'post_data',
    'request_file',
    'method',
    'data',
    'prefix',
    'suffix',
    'database',
    'table',
    'columns',
    'condition',
    'csrf_token_param',
    'data_with_token',
    'local_file',
    'remote_path',
    'target_network',
    'target_dns',
    'target_url',
    'backup_group',
    'group_name',
    'target_user',
    'replication_account',
    'session_name'
];

/**
 * Replaces all placeholders (e.g., `[target_host]`) in the given command string
 * with their corresponding values from targetParams. If a value is missing or empty,
 * the placeholder remains unchanged in the output.
 */
export const replaceParams = (
    targetParams: TargetParams,
    command: string
): string => {
    let result = command;

    for (const key of PLACEHOLDERS) {
        const placeholder = `[${key}]`;
        const value = targetParams[key] || placeholder;
        // Construct a global regex to match the exact placeholder.
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        result = result.replace(regex, value);
    }

    return result;
};

/**
 * Reverts any inserted parameter values back to their placeholder form (e.g., `myhost.com` → `[target_host]`).
 * Iterates over all keys in targetParams; for each non-empty value, escapes it for safe regex usage and replaces
 * occurrences of that literal value in the command string with the corresponding placeholder.
 */
export const revertParams = (
    targetParams: TargetParams,
    command: string
): string => {
    let result = command;

    for (const key of PLACEHOLDERS) {
        const value = targetParams[key];
        if (!value) continue; // Skip if no value provided

        // Escape special regex characters in the value to safely build a search regex
        const safeValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeValue, 'g');
        const placeholder = `[${key}]`;

        result = result.replace(regex, placeholder);
    }

    return result;
};