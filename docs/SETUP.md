# セットアップ・起動ガイド

## スマホから確認する方法

### 1. Expo Go アプリをインストール

- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. 起動（推奨: LAN モード）

```bash
npm start
```

または

```bash
npx expo start --lan --port 8082
```

- 起動後、ターミナルに **QR コード**が表示されます
- **スマホと PC を同じ Wi‑Fi に接続**してください
- Expo Go アプリで QR コードをスキャンして接続

### 3. トンネルモード（別ネットワーク時）

スマホが PC と別ネットワーク（例: スマホは LTE）の場合はトンネルが必要です。

```bash
npm run start:tunnel
```

**注意**: `ngrok tunnel took too long to connect` が出る場合:
- ファイアウォール・VPN・ネットワーク制限の影響で失敗することがあります
- その場合は **LAN モード**（同じ Wi‑Fi）で試してください

### ポート 8081 が使用中の場合

```bash
npx expo start --lan --port 8082
```

- デフォルトの `npm start` はポート 8082 を使用するように設定済みです

---

## トラブルシューティング: リクエストタイムアウト / アンノウンエラー

スマホで QR コードをスキャンした際に「Request timeout」「Unknown error」が出る場合、**Windows ファイアウォール**が原因であることが多いです。

### 対処 1: Node.js をファイアウォールで許可（推奨）

1. **Windows の設定** → **プライバシーとセキュリティ** → **Windows セキュリティ** → **ファイアウォールとネットワーク保護**
2. **アプリがファイアウォールを通過することを許可** をクリック
3. **設定の変更** をクリック
4. **Node.js (JavaScript Runtime)** を探す
   - 見つからない場合: **別のアプリの許可** → **参照** → `C:\Program Files\nodejs\node.exe` を選択
5. **プライベート** にチェックを入れる
6. **OK** で保存

### 対処 2: ネットワークプロファイルを「プライベート」に変更

Wi‑Fi が「パブリック」だと接続をブロックすることがあります。

1. **設定** → **ネットワークとインターネット** → **Wi‑Fi** → 接続中のネットワークをクリック
2. **ネットワークプロファイル** を **プライベート** に変更

または PowerShell（管理者）で:

```powershell
Get-NetConnectionProfile | Set-NetConnectionProfile -NetworkCategory Private
```

### 対処 3: 一時的にファイアウォールを無効化して確認

**設定** → **プライバシーとセキュリティ** → **Windows セキュリティ** → **ファイアウォールとネットワーク保護** → **プライベートネットワーク** のファイアウォールを一時的にオフにして、接続できるか確認してください。確認後は必ずオンに戻してください。

### その他の確認

- スマホと PC が**同じ Wi‑Fi** に接続されているか
- **VPN** をオフにして試す
- **ルーターの AP アイソレーション** が有効だと端末間通信がブロックされる場合があります

### 「This is taking much longer than it should」→ タイムアウトする場合

Metro が**誤った IP**（WSL、VirtualBox など）を検出している可能性があります。

**対処: 正しい IP を指定して起動**

PowerShell で実行:
```powershell
.\scripts\start-expo-lan.ps1
```

または、手動で IP を指定:
```powershell
# 自分の Wi-Fi IP を確認して設定（例: 192.168.100.39）
$env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.100.39"
npx expo start --lan --port 8082 --clear
```

**IP の確認**: `ipconfig` で「IPv4 アドレス」を確認（192.168.x.x の形式）

### その他のタイムアウト対策

1. **Metro キャッシュをクリアして起動**
   ```bash
   npm run start:lan
   ```
   または `npx expo start --lan --port 8082 --clear`

2. **.expo フォルダを削除**
   ```powershell
   Remove-Item -Recurse -Force .expo
   ```

3. **Expo のプロセスを一度終了**
   - ターミナルで Ctrl+C で Expo を停止
   - 再度起動
