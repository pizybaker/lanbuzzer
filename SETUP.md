# LAN Buzzer Setup Instructions

## Prerequisites
- Mac computer
- Router (turned on)
- LAN/Ethernet cable
- Node.js installed (if not, download from nodejs.org)

## Step-by-Step Setup

### Step 1: Install Dependencies
**IMPORTANT: Do this BEFORE configuring network settings**

1. Open **Terminal**
2. Navigate to the project directory:
   ```bash
   cd /dir../lan-buzzer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Wait for installation to complete. You should see `node_modules/` folder created.

### Step 2: Connect Your Mac to Router

1. **Turn OFF WiFi** on your Mac:
   - Click the WiFi icon in the menu bar (top right)
   - Select "Turn Wi-Fi Off"
   - OR go to **System Settings** → **Network** → **Wi-Fi** → Turn OFF

2. **Connect LAN Cable**:
   - Plug one end of the Ethernet/LAN cable into your Mac's Ethernet port
   - Plug the other end into your router
   - Make sure the router is powered on

3. Verify connection:
   - You should see an Ethernet icon in the menu bar (or in System Settings)
   - The icon should show it's connected

### Step 3: Configure Network Settings on Mac

1. Open **System Settings** (or System Preferences on older macOS)

2. Go to **Network**

3. Select **Ethernet** (or "Ethernet 1" if multiple adapters)

4. Click **Details...** (or the gear icon ⚙️)

5. Select the **TCP/IP** tab

6. Change **Configure IPv4** from "Using DHCP" to **"Manually"**

7. Enter the following settings:
   - **IP Address**: `192.168.0.100`
   - **Subnet Mask**: `255.255.255.0`
   - **Router**: `192.168.0.1`
   - **DNS Servers**: `8.8.8.8` (or leave empty)

8. Press ok 

### Step 4: Turn Off Firewall

1. In **System Settings** → **Network**
2. Click **Firewall** (or go to **Security & Privacy** → **Firewall**)
3. Turn **Firewall OFF**
4. Click **Apply** if prompted

**Why?** The firewall can block incoming connections from other devices on your network.

### Step 5: Verify Your IP Address

1. Open **Terminal**
2. Run:
   ```bash
   ifconfig | grep "inet "
   ```
3. Look for the IP address under `en0` (Ethernet) - it should be `192.168.0.100` (or `192.168.1.100`)

### Step 6: Start the Server

1. In **Terminal**, make sure you're in the project directory:
   ```bash
   cd /dir/lan-buzzer
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. You should see output like:
   ```
   ============================================================
   LAN BUZZER SERVER RUNNING
   ============================================================
   Local:   http://localhost:3000
   Network: http://192.168.0.100:3000
   Admin:   http://192.168.0.100:3000/secret69
   ============================================================
   Admin Password: admin123
   ============================================================
   ```

**Note**: The IP address shown (`192.168.0.100`) is your Mac's IP. Use this for all devices.

### Step 7: Connect Participants

### If u dont wnna use ip
- go to general, about me. fetch macbook name. ( mine is windowsm3)
- http://windowsm3.local:3000

#### On Your Mac (Host):
- Open browser and go to: `http://localhost:3000` or `http://192.168.0.100:3000`

#### On Other Devices (Phones, Tablets, Laptops):
1. **Connect to WiFi**: Make sure devices are connected to the **same WiFi network** as your router
2. **Open browser** and go to: `http://192.168.0.100:3000` (use the IP shown in server output)
3. Enter name and join the game

### Step 8: Access Admin Panel

1. Open browser and go to: `http://192.168.0.100:3000/secret69` (or `http://localhost:3000/secret69`)
2. Enter password: `admin123` (default password, change in `server.js` if needed)
3. You'll see the admin dashboard with:
   - Lock/Unlock controls
   - Participant list
   - Winner display
   - Debug log

## Features

### Admin Dashboard (`/secret69`):
- **Lock/Unlock Buzzer**: Control when participants can buzz
- **Reset Game**: Clear winner and unlock buzzer
- **View Participants**: See who's connected
- **View Winner**: See who clicked first with timestamp
- **Debug Log**: Monitor all events in real-time
- **Logout**: Log out of admin panel

### Participant View (`/`):
- **Join Game**: Enter name to participate (no duplicate names allowed)
- **Buzz Button**: Full-screen button on mobile, click or press SPACE on desktop
- **Status Indicator**: See if buzzer is ready or locked
- **Team Name Display**: See your own team name
- **Winner Display**: See who won

## Troubleshooting

### Can't connect from other devices?
1. **Check WiFi**: Make sure all devices are on the **same WiFi network** as your router
2. **Check Firewall**: Make sure firewall is **OFF** on Mac
3. **Verify IP**: Use the exact IP address shown in server output
4. **Test locally first**: Try accessing from Mac first (`http://localhost:3000`) to confirm server is running
5. **Router settings**: Some routers have "AP Isolation" enabled which blocks device-to-device communication - disable it in router settings
6. **Check Ethernet**: Make sure Ethernet cable is properly connected and router is on

### Server won't start?
1. **Check port**: Make sure port 3000 is not in use:
   ```bash
   lsof -i :3000
   ```
2. **Kill process**: If port is in use, kill the process:
   ```bash
   kill -9 <PID>
   ```
3. **Check dependencies**: Make sure you ran `npm install`:
   ```bash
   npm install
   ```

### Can't access admin panel?
1. **Check URL**: Make sure you're using `/secret69` path: `http://YOUR_IP:3000/secret69`
2. **Check password**: Default password is `admin123` (check `server.js` line 13 if changed)
3. **Check connection**: Make sure server is running and you can access the main page

### Network issues?
1. **Test connection**: Ping your router:
   ```bash
   ping 192.168.0.1
   ```
2. **Check Ethernet**: Verify Ethernet cable is connected properly
3. **Restart router**: Try restarting your router if needed
4. **Reset network**: If all else fails, try setting IP back to DHCP temporarily to test connection, then switch back to manual

### "Please register your name first" error?
- This happens if you try to buzz before registering
- The app will automatically redirect you back to the registration screen
- Enter your name and click "Join Game" again

### Duplicate name error?
- Each participant must have a unique name (case-insensitive)
- If you see "This name is already taken", choose a different name

## Changing Admin Password

Edit `server.js` and change line 13:
```javascript
const adminPassword = "your-new-password";
```

Then restart the server.

## Security Note

This setup is for **local network use only**. The admin password is stored in plain text in `server.js`. For production use, consider implementing proper authentication and security measures.

## Quick Reference

- **Participant URL**: `http://YOUR_IP:3000`
- **Admin URL**: `http://YOUR_IP:3000/secret69`
- **Default Admin Password**: `admin123`
- **Default Port**: `3000`
- **Router IP**: `192.168.0.1` (or `192.168.1.1`)
- **Mac IP**: `192.168.0.100` (or `192.168.1.100`)

## Tips

- Keep Terminal open while server is running
- Use `Ctrl+C` in Terminal to stop the server
- The server shows your IP address when it starts - use that exact IP
- Mobile devices work best with full-screen buzzer button
- Desktop users can press SPACE bar to buzz
- Admin can see real-time debug log of all events
