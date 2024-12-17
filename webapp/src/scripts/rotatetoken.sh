#!/bin/bash

# 设置变量
REGION="cn-north-1"  # 你的区域
TUNNEL_ID="cdb86544-6ccc-4a73-a7d5-ad32df88277d"  # 替换为你的 tunnelId
PROFILE="China-ResourceAdmin-079496119912"  # AWS CLI 配置文件

# 输出当前的访问令牌
echo "Rotating access token for tunnel ID: $TUNNEL_ID"

# 轮换访问令牌
rotate_response=$(aws iotsecuretunneling rotate-tunnel-access-token \
    --region $REGION \
    --tunnel-id $TUNNEL_ID \
    --client-mode SOURCE \
    --profile $PROFILE)

# 检查是否成功
if [ $? -eq 0 ]; then
    echo "Access token rotated successfully:"
    echo "$rotate_response"
else
    echo "Failed to rotate access token."
fi