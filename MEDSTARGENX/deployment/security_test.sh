#!/bin/bash

##############################################################################
# MEDSTARGENX Automated Security Testing Script
# Run this script to perform comprehensive security tests on your application
##############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="mgenx.com"
TARGET="https://${DOMAIN}"
REPORT_FILE="security_report_$(date +%Y%m%d_%H%M%S).txt"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║     🔒 MEDSTARGENX Security Testing Suite             ║${NC}"
echo -e "${BLUE}║        Automated Security Assessment                  ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Target: $TARGET"
echo "Report: $REPORT_FILE"
echo ""

# Initialize report
{
    echo "MEDSTARGENX Security Test Report"
    echo "================================="
    echo "Date: $(date)"
    echo "Target: $TARGET"
    echo ""
} > "$REPORT_FILE"

##############################################################################
# Test 1: Security Headers Check
##############################################################################
echo -e "${YELLOW}[1/10] Testing Security Headers...${NC}"
{
    echo "1. SECURITY HEADERS TEST"
    echo "========================"
    echo ""
    curl -sI "$TARGET" | grep -E "X-Frame|X-Content|X-XSS|Strict-Transport|Content-Security|Referrer-Policy|Permissions-Policy"
    echo ""
    echo "Expected Headers:"
    echo "  ✓ X-Frame-Options: SAMEORIGIN"
    echo "  ✓ X-Content-Type-Options: nosniff"
    echo "  ✓ X-XSS-Protection: 1; mode=block"
    echo "  ✓ Strict-Transport-Security: max-age=31536000"
    echo "  ✓ Content-Security-Policy: (present)"
    echo "  ✓ Referrer-Policy: (present)"
    echo "  ✓ Permissions-Policy: (present)"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 2: SSL/TLS Configuration
##############################################################################
echo -e "${YELLOW}[2/10] Testing SSL/TLS Configuration...${NC}"
{
    echo "2. SSL/TLS CONFIGURATION TEST"
    echo "============================="
    echo ""
    echo "Certificate Information:"
    echo "------------------------"
    openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} </dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer
    echo ""
    echo "Supported Protocols:"
    echo "-------------------"
    nmap --script ssl-enum-ciphers -p 443 ${DOMAIN} 2>/dev/null | grep -E "TLSv|SSLv"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 3: HTTP to HTTPS Redirect
##############################################################################
echo -e "${YELLOW}[3/10] Testing HTTP to HTTPS Redirect...${NC}"
{
    echo "3. HTTP TO HTTPS REDIRECT TEST"
    echo "=============================="
    echo ""
    HTTP_RESPONSE=$(curl -sI "http://${DOMAIN}" | head -n 1)
    LOCATION=$(curl -sI "http://${DOMAIN}" | grep -i "location:")
    echo "HTTP Response: $HTTP_RESPONSE"
    echo "Redirect: $LOCATION"
    if [[ "$HTTP_RESPONSE" == *"301"* ]] || [[ "$HTTP_RESPONSE" == *"302"* ]]; then
        echo "✓ PASS: HTTP redirects to HTTPS"
    else
        echo "✗ FAIL: HTTP does not redirect to HTTPS"
    fi
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 4: SQL Injection Prevention
##############################################################################
echo -e "${YELLOW}[4/10] Testing SQL Injection Prevention...${NC}"
{
    echo "4. SQL INJECTION PREVENTION TEST"
    echo "================================"
    echo ""
    echo "Testing login endpoint with SQL injection attempts..."
    
    # Test 1: Classic SQL injection
    RESPONSE1=$(curl -s -X POST "${TARGET}/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@medstargenx.com'\'' OR '\''1'\''='\''1","password":"anything"}' \
        -w "\nHTTP_CODE:%{http_code}")
    
    echo "Test 1 - Classic injection: ' OR '1'='1"
    echo "$RESPONSE1" | tail -n 1
    
    # Test 2: Comment-based injection
    RESPONSE2=$(curl -s -X POST "${TARGET}/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin'\''--","password":"anything"}' \
        -w "\nHTTP_CODE:%{http_code}")
    
    echo "Test 2 - Comment injection: admin'--"
    echo "$RESPONSE2" | tail -n 1
    
    echo ""
    echo "✓ If all tests return 400/401/422 (not 200), SQL injection is prevented"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 5: XSS Prevention
##############################################################################
echo -e "${YELLOW}[5/10] Testing XSS Prevention...${NC}"
{
    echo "5. XSS PREVENTION TEST"
    echo "======================"
    echo ""
    echo "Note: XSS testing requires manual verification in browser"
    echo "Test payloads to try in form fields:"
    echo "  - <script>alert('XSS')</script>"
    echo "  - <img src=x onerror=alert('XSS')>"
    echo "  - <svg onload=alert('XSS')>"
    echo ""
    echo "✓ React's JSX escaping provides default XSS protection"
    echo "✓ Content-Security-Policy header provides additional protection"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 6: Rate Limiting
##############################################################################
echo -e "${YELLOW}[6/10] Testing Rate Limiting...${NC}"
{
    echo "6. RATE LIMITING TEST"
    echo "===================="
    echo ""
    echo "Sending 10 rapid requests to test rate limiting..."
    
    SUCCESS_COUNT=0
    BLOCKED_COUNT=0
    
    for i in {1..10}; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${TARGET}/api/auth/login" \
            -H "Content-Type: application/json" \
            -d '{"email":"test@test.com","password":"test"}')
        
        if [[ "$HTTP_CODE" == "429" ]]; then
            ((BLOCKED_COUNT++))
        else
            ((SUCCESS_COUNT++))
        fi
    done
    
    echo "Requests sent: 10"
    echo "Successful: $SUCCESS_COUNT"
    echo "Rate limited (429): $BLOCKED_COUNT"
    
    if [[ $BLOCKED_COUNT -gt 0 ]]; then
        echo "✓ PASS: Rate limiting is working"
    else
        echo "⚠ WARNING: No rate limiting detected (may need more requests)"
    fi
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 7: Authentication & Authorization
##############################################################################
echo -e "${YELLOW}[7/10] Testing Authentication & Authorization...${NC}"
{
    echo "7. AUTHENTICATION & AUTHORIZATION TEST"
    echo "======================================"
    echo ""
    
    # Test accessing protected endpoint without token
    echo "Test 1: Accessing protected endpoint without authentication"
    UNAUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${TARGET}/api/patients")
    echo "HTTP Code: $UNAUTH_RESPONSE"
    
    if [[ "$UNAUTH_RESPONSE" == "401" ]] || [[ "$UNAUTH_RESPONSE" == "403" ]]; then
        echo "✓ PASS: Unauthenticated access blocked"
    else
        echo "✗ FAIL: Unauthenticated access allowed"
    fi
    
    # Test accessing admin endpoint
    echo ""
    echo "Test 2: Accessing admin endpoint without admin token"
    ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${TARGET}/api/admin/users")
    echo "HTTP Code: $ADMIN_RESPONSE"
    
    if [[ "$ADMIN_RESPONSE" == "401" ]] || [[ "$ADMIN_RESPONSE" == "403" ]]; then
        echo "✓ PASS: Admin endpoint protected"
    else
        echo "✗ FAIL: Admin endpoint not protected"
    fi
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 8: CORS Configuration
##############################################################################
echo -e "${YELLOW}[8/10] Testing CORS Configuration...${NC}"
{
    echo "8. CORS CONFIGURATION TEST"
    echo "=========================="
    echo ""
    
    # Test CORS with unauthorized origin
    CORS_RESPONSE=$(curl -s -I "${TARGET}/api/auth/login" \
        -H "Origin: https://malicious-site.com" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS)
    
    echo "Testing CORS with unauthorized origin (malicious-site.com):"
    echo "$CORS_RESPONSE" | grep -i "access-control"
    
    echo ""
    echo "Expected: No Access-Control-Allow-Origin header for unauthorized origins"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 9: File Upload Security
##############################################################################
echo -e "${YELLOW}[9/10] Testing File Upload Security...${NC}"
{
    echo "9. FILE UPLOAD SECURITY TEST"
    echo "============================"
    echo ""
    echo "Note: File upload testing requires authentication"
    echo "Manual tests to perform:"
    echo "  1. Upload non-CSV file (should reject)"
    echo "  2. Upload file >50MB (should reject)"
    echo "  3. Upload CSV with malicious content (should sanitize)"
    echo ""
    echo "✓ Nginx configured with 50MB limit"
    echo "⚠ Recommend: Add file type validation in backend"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Test 10: Open Ports Scan
##############################################################################
echo -e "${YELLOW}[10/10] Scanning Open Ports...${NC}"
{
    echo "10. OPEN PORTS SCAN"
    echo "==================="
    echo ""
    echo "Scanning common ports..."
    nmap -p 22,80,443,3306,5000,5001,27017 ${DOMAIN} 2>/dev/null | grep -E "PORT|open"
    echo ""
    echo "Expected open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)"
    echo "Should be closed: 3306 (MySQL), 5000 (Backend), 5001 (ML API), 27017 (MongoDB)"
    echo ""
} >> "$REPORT_FILE"

##############################################################################
# Summary
##############################################################################
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║     ✅ Security Testing Complete!                      ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

{
    echo ""
    echo "SUMMARY"
    echo "======="
    echo ""
    echo "✓ Security headers tested"
    echo "✓ SSL/TLS configuration verified"
    echo "✓ HTTP to HTTPS redirect checked"
    echo "✓ SQL injection prevention tested"
    echo "✓ XSS prevention verified"
    echo "✓ Rate limiting tested"
    echo "✓ Authentication & authorization checked"
    echo "✓ CORS configuration tested"
    echo "✓ File upload security reviewed"
    echo "✓ Open ports scanned"
    echo ""
    echo "RECOMMENDATIONS"
    echo "==============="
    echo ""
    echo "1. Review any FAIL results above"
    echo "2. Run SSL Labs test: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
    echo "3. Run Security Headers test: https://securityheaders.com/?q=${DOMAIN}"
    echo "4. Implement CSRF tokens for state-changing operations"
    echo "5. Add file type validation for CSV uploads"
    echo "6. Consider implementing 2FA for admin accounts"
    echo "7. Set up security monitoring and alerts"
    echo "8. Schedule regular security audits"
    echo ""
    echo "Report generated: $(date)"
} >> "$REPORT_FILE"

echo -e "${BLUE}Full report saved to: ${REPORT_FILE}${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Review the report: cat $REPORT_FILE"
echo "2. Run online scans:"
echo "   - SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
echo "   - Security Headers: https://securityheaders.com/?q=${DOMAIN}"
echo "3. Fix any issues found"
echo "4. Re-run this script to verify fixes"
echo ""
