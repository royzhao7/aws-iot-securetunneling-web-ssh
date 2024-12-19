#!/bin/bash
# 设置变量
REGION="cn-north-1"  # 你的区域
PROFILE="China-ResourceAdmin-079496119912"  # AWS CLI 配置文件
THING="IotDataDev-conti-hdk-thing"
ENDPOINT="https://api.tunneling.iot.cn-north-1.amazonaws.com.cn"

# 获取脚本所在的目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TUNNEL_INFO_FILE="$SCRIPT_DIR/tunnel_info.txt"

echo "当前工作目录是: $SCRIPT_DIR"

# 读取当前的 TUNNEL_ID
if [ -f "$TUNNEL_INFO_FILE" ]; then
    TUNNEL_ID=$(cat $TUNNEL_INFO_FILE)
else
    echo "Error: tunnel_info.txt file not found."
    exit 1
fi
# 输出当前的访问令牌
echo "Rotating access token for tunnel ID: $TUNNEL_ID"


# 检查 AWS SSO 登录状态
if ! aws sts get-caller-identity --profile "$PROFILE" >/dev/null 2>&1; then
    echo "You are not logged in. Please log in using AWS SSO."
    aws sso login --profile "$PROFILE"
    if [ $? -ne 0 ]; then
        echo "Failed to log in to AWS SSO."
        exit 1
    fi
fi






# 旋转访问令牌
rotate_response=$(aws iotsecuretunneling rotate-tunnel-access-token \
    --region $REGION \
    --tunnel-id $TUNNEL_ID \
    --client-mode SOURCE \
    --profile $PROFILE)

# 检查是否成功
if [ $? -eq 0 ]; then
    echo "Access token rotated successfully:"
    echo "$rotate_response" | jq .
else
    echo "Failed to rotate access token. Attempting to reopen the tunnel..."

    # 重新打开隧道
    open_response=$(aws iotsecuretunneling open-tunnel \
        --region $REGION \
        --endpoint $ENDPOINT \
        --destination-config thingName=$THING,services=SSH \
        --timeout-config maxLifetimeTimeoutMinutes=60 \
        --profile $PROFILE)

    # 检查重新打开隧道是否成功
    if [ $? -eq 0 ]; then
        echo "Tunnel reopened successfully:"
        echo "$open_response" | jq .

        # 提取新的 TUNNEL_ID
        NEW_TUNNEL_ID=$(echo "$open_response" | jq -r '.tunnelId')

        # 更新文件中的 TUNNEL_ID
        echo "$NEW_TUNNEL_ID" > $TUNNEL_INFO_FILE
        echo "Updated TUNNEL_ID in $TUNNEL_INFO_FILE to $NEW_TUNNEL_ID."
    else
        echo "Failed to reopen the tunnel."
        exit 1
    fi
fi