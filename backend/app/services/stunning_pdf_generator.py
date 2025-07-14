"""
Stunning PDF Generator - Recreating the exact design from the user's reference image
Creates PDFs with large color blocks, bold numbers, and sophisticated layouts
"""

import io
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Frame, Image, KeepTogether
from reportlab.lib.utils import ImageReader
from reportlab.graphics.shapes import Drawing, Rect, Line, Circle, String
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart, HorizontalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor, Color
# Canvas import handled in methods


class StunningPDFGenerator:
    """PDF generator matching the exact design reference provided"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_colors()
        self._create_custom_styles()
        
    def _setup_colors(self):
        """Set up colors to match WealthTracker Pro brand colors"""
        # WealthTracker Pro brand colors
        self.primary_black = HexColor('#0f172a')   # Primary black
        self.dark_black = HexColor('#1e293b')      # Darker black
        self.brand_pink = HexColor('#ec4899')      # Brand pink
        self.dark_pink = HexColor('#be185d')       # Darker pink
        self.pure_white = HexColor('#ffffff')      # Pure white
        self.cream_white = HexColor('#f8fafc')     # Light background
        self.dark_text = HexColor('#2d2d2d')       # Dark text
        self.light_text = HexColor('#666666')      # Light text
        
    def _create_custom_styles(self):
        """Create styles matching the reference design"""
        # Large number style (01, 02, 03, etc.)
        self.large_number_style = ParagraphStyle(
            name='LargeNumber',
            fontSize=120,
            fontName='Helvetica-Bold',
            textColor=colors.white,
            alignment=TA_LEFT,
            spaceAfter=0
        )
        
        # Section title style
        self.section_title_style = ParagraphStyle(
            name='SectionTitle',
            fontSize=32,
            fontName='Helvetica-Bold',
            textColor=colors.white,
            alignment=TA_LEFT,
            spaceAfter=10
        )
        
        # Body text on colored background
        self.colored_body_style = ParagraphStyle(
            name='ColoredBody',
            fontSize=14,
            fontName='Helvetica',
            textColor=colors.white,
            alignment=TA_LEFT,
            spaceAfter=8,
            leading=20
        )
        
        # Regular body text
        self.regular_body_style = ParagraphStyle(
            name='RegularBody',
            fontSize=12,
            fontName='Helvetica',
            textColor=self.dark_text,
            alignment=TA_LEFT,
            spaceAfter=6,
            leading=16
        )
        
    def _create_full_page_colored_section(self, canvas, page_width, page_height, color, number, title, content):
        """Create a full-page colored section like in the reference"""
        # Fill entire page with color
        canvas.setFillColor(color)
        canvas.rect(0, 0, page_width, page_height, fill=1, stroke=0)
        
        # Add large number in top-left
        canvas.setFont('Helvetica-Bold', 120)
        canvas.setFillColor(colors.white)
        canvas.drawString(60, page_height - 180, number)
        
        # Add title
        canvas.setFont('Helvetica-Bold', 32)
        canvas.drawString(60, page_height - 240, title)
        
        # Add content lines
        canvas.setFont('Helvetica', 14)
        y_position = page_height - 300
        for line in content:
            canvas.drawString(60, y_position, line)
            y_position -= 25
    
    def _create_half_page_colored_section(self, canvas, page_width, page_height, color, number, title, content):
        """Create a half-page colored section like in the reference"""
        # Fill left half with color
        canvas.setFillColor(color)
        canvas.rect(0, 0, page_width/2, page_height, fill=1, stroke=0)
        
        # Add large number
        canvas.setFont('Helvetica-Bold', 100)
        canvas.setFillColor(colors.white)
        canvas.drawString(40, page_height - 150, number)
        
        # Add title
        canvas.setFont('Helvetica-Bold', 24)
        canvas.drawString(40, page_height - 200, title)
        
        # Add content
        canvas.setFont('Helvetica', 12)
        y_position = page_height - 240
        for line in content:
            canvas.drawString(40, y_position, line)
            y_position -= 20
    
    def _create_cover_page(self, canvas, user_data, financial_data):
        """Create stunning cover page matching reference design"""
        page_width = A4[0]
        page_height = A4[1]
        
        # Large colored section taking most of the page
        canvas.setFillColor(self.primary_black)
        canvas.rect(0, page_height/3, page_width, page_height*2/3, fill=1, stroke=0)
        
        # Main title in large white text
        canvas.setFont('Helvetica-Bold', 48)
        canvas.setFillColor(colors.white)
        canvas.drawString(60, page_height - 120, 'WEALTH')
        canvas.drawString(60, page_height - 180, 'REPORT')
        
        # Year/date in smaller text
        canvas.setFont('Helvetica', 16)
        canvas.drawString(60, page_height - 220, datetime.now().strftime('%Y'))
        
        # Client name in elegant text
        canvas.setFont('Helvetica-Bold', 20)
        canvas.drawString(60, page_height - 280, user_data.get('name', 'VALUED CLIENT'))
        
        # Financial summary in bottom section
        canvas.setFont('Helvetica', 14)
        canvas.drawString(60, page_height - 320, f"Net Worth: £{financial_data.get('net_worth', 0):,.0f}")
        canvas.drawString(60, page_height - 340, f"Health Score: {financial_data.get('health_score', 0)}/1000")
        
        # Small branded section at bottom
        canvas.setFillColor(self.brand_pink)
        canvas.rect(0, 0, page_width, 80, fill=1, stroke=0)
        
        canvas.setFont('Helvetica-Bold', 16)
        canvas.setFillColor(colors.white)
        canvas.drawString(60, 40, 'WEALTHTRACKER PRO')
        canvas.setFont('Helvetica', 12)
        canvas.drawString(60, 25, 'Professional Wealth Management')
    
    def generate_wealth_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate a stunning wealth report matching the reference design"""
        buffer = io.BytesIO()
        
        # Create custom PDF with manual canvas control
        from reportlab.pdfgen import canvas
        c = canvas.Canvas(buffer, pagesize=A4)
        
        page_width = A4[0]
        page_height = A4[1]
        
        # PAGE 1: Cover Page
        self._create_cover_page(c, user_data, financial_data)
        c.showPage()
        
        # PAGE 2: Full-page colored section - Financial Overview
        self._create_full_page_colored_section(
            c, page_width, page_height, self.primary_black, 
            "01", "FINANCIAL OVERVIEW",
            [
                f"Net Worth: £{financial_data.get('net_worth', 0):,.0f}",
                f"Total Assets: £{financial_data.get('total_assets', 0):,.0f}",
                f"Monthly Income: £{financial_data.get('monthly_income', 0):,.0f}",
                f"Monthly Expenses: £{financial_data.get('monthly_expenses', 0):,.0f}",
                f"Health Score: {financial_data.get('health_score', 0)}/1000",
                "",
                "Your financial position demonstrates strong",
                "wealth accumulation with diversified assets",
                "across multiple categories and consistent",
                "growth trajectory over time."
            ]
        )
        c.showPage()
        
        # PAGE 3: Half-page colored section - Asset Allocation
        self._create_half_page_colored_section(
            c, page_width, page_height, self.brand_pink,
            "02", "ASSET ALLOCATION",
            [
                "Cash & Savings:",
                f"£{financial_data.get('assets', {}).get('Cash & Savings', 0):,.0f}",
                "",
                "Investments:",
                f"£{financial_data.get('assets', {}).get('Investments', 0):,.0f}",
                "",
                "Property:",
                f"£{financial_data.get('assets', {}).get('Property', 0):,.0f}",
                "",
                "Diversification Score: 8.5/10"
            ]
        )
        
        # Add content to white section (right half)
        c.setFillColor(self.dark_text)
        c.setFont('Helvetica-Bold', 18)
        c.drawString(page_width/2 + 40, page_height - 100, 'ASSET BREAKDOWN')
        
        c.setFont('Helvetica', 12)
        y_pos = page_height - 140
        
        assets = financial_data.get('assets', {
            'Cash & Savings': 75000,
            'Investments': 175000,
            'Property': 100000
        })
        
        total_assets = sum(assets.values())
        
        for asset_type, value in assets.items():
            percentage = (value / total_assets) * 100 if total_assets > 0 else 0
            c.drawString(page_width/2 + 40, y_pos, f"{asset_type}")
            c.drawString(page_width/2 + 40, y_pos - 15, f"£{value:,.0f} ({percentage:.1f}%)")
            y_pos -= 50
        
        c.showPage()
        
        # PAGE 4: Full-page colored section - Wealth Trends
        self._create_full_page_colored_section(
            c, page_width, page_height, self.primary_black,
            "03", "WEALTH TRENDS",
            [
                "6-Month Performance:",
                "• Growth: +£45,000 (+16.1%)",
                "• Monthly Average: £7,500",
                "• Best Month: April 2024",
                "",
                "12-Month Performance:",
                "• Total Growth: +£78,000 (+32.8%)",
                "• Compound Annual Growth: 28.5%",
                "• Risk-Adjusted Return: 15.2%",
                "",
                "Key Drivers:",
                "• Investment portfolio performance",
                "• Property value appreciation",
                "• Consistent savings discipline"
            ]
        )
        c.showPage()
        
        # PAGE 5: Half-page colored section - Strategic Recommendations
        self._create_half_page_colored_section(
            c, page_width, page_height, self.brand_pink,
            "04", "STRATEGIC ADVICE",
            [
                "Immediate Actions:",
                "• Increase emergency fund",
                "• Diversify internationally",
                "• Optimize tax efficiency",
                "",
                "Medium-term Goals:",
                "• Property investment review",
                "• Pension contribution increase",
                "• Insurance coverage audit",
                "",
                "Long-term Strategy:",
                "• Wealth preservation planning",
                "• Estate planning review",
                "• Legacy structure setup"
            ]
        )
        
        # Add detailed recommendations to white section
        c.setFillColor(self.dark_text)
        c.setFont('Helvetica-Bold', 18)
        c.drawString(page_width/2 + 40, page_height - 100, 'DETAILED RECOMMENDATIONS')
        
        c.setFont('Helvetica', 11)
        recommendations = [
            "1. Increase emergency fund to 8 months of expenses",
            "2. Consider international equity diversification",
            "3. Maximize pension contributions for tax benefits",
            "4. Review life insurance coverage adequacy",
            "5. Explore property investment opportunities",
            "6. Implement tax-efficient investment strategies",
            "7. Schedule quarterly portfolio rebalancing",
            "8. Consider wealth preservation trusts"
        ]
        
        y_pos = page_height - 140
        for rec in recommendations:
            c.drawString(page_width/2 + 40, y_pos, rec)
            y_pos -= 25
        
        c.showPage()
        
        # PAGE 6: Full-page colored section - Future Projections
        current_wealth = financial_data.get('net_worth', 0)
        
        self._create_full_page_colored_section(
            c, page_width, page_height, self.primary_black,
            "05", "PROJECTIONS",
            [
                "Conservative Scenario (5% annual growth):",
                f"• 5 years: £{current_wealth * 1.28:,.0f}",
                f"• 10 years: £{current_wealth * 1.63:,.0f}",
                f"• 15 years: £{current_wealth * 2.08:,.0f}",
                "",
                "Moderate Scenario (8% annual growth):",
                f"• 5 years: £{current_wealth * 1.47:,.0f}",
                f"• 10 years: £{current_wealth * 2.16:,.0f}",
                f"• 15 years: £{current_wealth * 3.17:,.0f}",
                "",
                "Optimistic Scenario (12% annual growth):",
                f"• 5 years: £{current_wealth * 1.76:,.0f}",
                f"• 10 years: £{current_wealth * 3.11:,.0f}",
                f"• 15 years: £{current_wealth * 5.47:,.0f}"
            ]
        )
        c.showPage()
        
        # Save PDF
        c.save()
        buffer.seek(0)
        return buffer.read()
    
    def _draw_circular_score(self, canvas, x, y, radius, score, max_score=100):
        """Draw a circular progress indicator with score"""
        # Calculate angle based on score (0-360 degrees)
        angle = (score / max_score) * 360
        
        # Draw outer circle (background)
        canvas.setStrokeColor(colors.lightgrey)
        canvas.setLineWidth(8)
        canvas.circle(x, y, radius, fill=0, stroke=1)
        
        # Draw progress arc
        if score >= 80:
            color = colors.green
        elif score >= 60:
            color = colors.orange
        else:
            color = colors.red
            
        canvas.setStrokeColor(color)
        canvas.setLineWidth(8)
        
        # Draw arc - this is simplified, for full arc drawing we'd need more complex path operations
        # For now, draw a thick circle segment
        canvas.circle(x, y, radius, fill=0, stroke=1)
        
        # Draw score text in center
        canvas.setFillColor(colors.black)
        canvas.setFont('Helvetica-Bold', 32)
        canvas.drawCentredText(x, y + 10, str(int(score)))
        canvas.setFont('Helvetica', 14)
        canvas.drawCentredText(x, y - 15, f'out of {max_score}')
    
    def _get_traffic_light_color(self, score):
        """Get traffic light color based on score"""
        if score >= 80:
            return colors.green
        elif score >= 60:
            return colors.orange
        else:
            return colors.red
    
    def _calculate_health_metrics(self, financial_data, user_data):
        """Calculate health metrics using real user data"""
        net_worth = financial_data.get('net_worth', 0)
        monthly_expenses = financial_data.get('monthly_expenses', 0)
        monthly_income = financial_data.get('monthly_income', 0)
        assets = financial_data.get('assets', {})
        
        # Emergency Fund Score (0-100)
        emergency_fund = assets.get('Cash & Savings', 0)
        months_coverage = (emergency_fund / monthly_expenses) if monthly_expenses > 0 else 0
        emergency_score = min(100, (months_coverage / 6) * 100)
        
        # Expense Ratio Score (0-100) - % of income spent on expenses
        if monthly_income > 0:
            expense_ratio = (monthly_expenses / monthly_income) * 100
            # Good: <70%, Warning: 70-85%, Poor: >85%
            if expense_ratio < 70:
                expense_ratio_score = 100
            elif expense_ratio < 85:
                expense_ratio_score = 100 - ((expense_ratio - 70) / 15) * 40  # 100 down to 60
            else:
                expense_ratio_score = max(0, 60 - ((expense_ratio - 85) / 15) * 60)  # 60 down to 0
        else:
            expense_ratio_score = 0
            
        # Milestone Achievement Score (0-100) - based on milestones data
        milestones_data = financial_data.get('milestones', [])
        if milestones_data:
            completed_milestones = sum(1 for m in milestones_data if m.get('is_completed', False))
            milestone_score = (completed_milestones / len(milestones_data)) * 100
        else:
            milestone_score = 0
        
        # Insurance Score (0-100) - based on actual insurance data
        insurance_policies = user_data.get('insurance_policies') or ''
        if insurance_policies and str(insurance_policies).strip():
            # Simple scoring based on having insurance policies documented
            insurance_score = 80  # Has some insurance
        else:
            insurance_score = 0  # No insurance documented
        
        # Diversification Score (0-100)
        total_assets = sum(assets.values())
        if total_assets > 0:
            # Calculate how evenly distributed assets are
            asset_ratios = [v/total_assets for v in assets.values()]
            # Simple diversification: penalize if one asset is >70%
            max_ratio = max(asset_ratios)
            diversification_score = max(0, 100 - (max_ratio - 0.7) * 200) if max_ratio > 0.7 else 100
        else:
            diversification_score = 0
            
        # Estate Planning Score (0-100) - based on actual estate planning data
        estate_score = 0
        
        # Check for will
        will_location = user_data.get('will_location') or ''
        if will_location and str(will_location).strip():
            estate_score += 40
            
        # Check for solicitor
        solicitor_name = user_data.get('solicitor_name') or ''
        if solicitor_name and str(solicitor_name).strip():
            estate_score += 30
            
        # Check for power of attorney
        power_of_attorney = user_data.get('power_of_attorney_location') or ''
        if power_of_attorney and str(power_of_attorney).strip():
            estate_score += 30
        
        # Overall score (weighted average)
        overall_score = (
            emergency_score * 0.20 +
            expense_ratio_score * 0.20 +
            milestone_score * 0.15 +
            insurance_score * 0.15 +
            diversification_score * 0.15 +
            estate_score * 0.15
        )
        
        return {
            'overall': overall_score,
            'emergency_fund': emergency_score,
            'expense_ratio': expense_ratio_score,
            'expense_percentage': (monthly_expenses / monthly_income * 100) if monthly_income > 0 else 0,
            'milestones': milestone_score,
            'insurance': insurance_score,
            'diversification': diversification_score,
            'estate_planning': estate_score
        }

    def generate_financial_health_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate financial health report with circular score and traffic light system"""
        buffer = io.BytesIO()
        
        from reportlab.pdfgen import canvas
        c = canvas.Canvas(buffer, pagesize=A4)
        
        page_width = A4[0]
        page_height = A4[1]
        
        # Calculate health metrics using real user data
        health_metrics = self._calculate_health_metrics(financial_data, user_data)
        overall_score = health_metrics['overall']
        
        # PAGE 1: Cover page with circular score
        c.setFillColor(self.primary_black)
        c.rect(0, page_height/2, page_width, page_height/2, fill=1, stroke=0)
        
        # Title
        c.setFont('Helvetica-Bold', 48)
        c.setFillColor(colors.white)
        c.drawString(60, page_height - 120, 'FINANCIAL')
        c.drawString(60, page_height - 180, 'HEALTH CHECK')
        
        # User name
        c.setFont('Helvetica-Bold', 20)
        c.drawString(60, page_height - 220, user_data.get('name', 'VALUED CLIENT'))
        
        # Large circular score in white section
        circle_x = page_width/2
        circle_y = page_height/4
        
        # Draw circular progress indicator
        radius = 80
        
        # Background circle
        c.setStrokeColor(colors.lightgrey)
        c.setLineWidth(12)
        c.circle(circle_x, circle_y, radius, fill=0, stroke=1)
        
        # Progress circle (simplified - just colored circle)
        score_color = self._get_traffic_light_color(overall_score)
        c.setStrokeColor(score_color)
        c.setLineWidth(12)
        c.circle(circle_x, circle_y, radius, fill=0, stroke=1)
        
        # Score text
        c.setFillColor(colors.black)
        c.setFont('Helvetica-Bold', 48)
        # Calculate text width to center it
        text_width = c.stringWidth(f'{int(overall_score)}', 'Helvetica-Bold', 48)
        c.drawString(circle_x - text_width/2, circle_y + 15, f'{int(overall_score)}')
        
        c.setFont('Helvetica', 16)
        text_width = c.stringWidth('out of 100', 'Helvetica', 16)
        c.drawString(circle_x - text_width/2, circle_y - 15, 'out of 100')
        
        # Score label
        c.setFont('Helvetica-Bold', 18)
        text_width = c.stringWidth('FINANCIAL HEALTH SCORE', 'Helvetica-Bold', 18)
        c.drawString(circle_x - text_width/2, circle_y - 50, 'FINANCIAL HEALTH SCORE')
        
        # Brand section
        c.setFillColor(self.brand_pink)
        c.rect(0, 0, page_width, 80, fill=1, stroke=0)
        
        c.setFont('Helvetica-Bold', 16)
        c.setFillColor(colors.white)
        c.drawString(60, 40, 'WEALTHTRACKER PRO')
        
        c.showPage()
        
        # PAGE 2: Traffic light breakdown
        self._create_full_page_colored_section(
            c, page_width, page_height, self.primary_black,
            "01", "HEALTH BREAKDOWN",
            [
                f"Emergency Fund: {int(health_metrics['emergency_fund'])}/100",
                "• 6 months expenses recommended",
                "• Current coverage assessment",
                "",
                f"Expense Control: {int(health_metrics['expense_ratio'])}/100",
                f"• {health_metrics['expense_percentage']:.1f}% of income spent",
                "• Target: <70% of income",
                "",
                f"Milestone Achievement: {int(health_metrics['milestones'])}/100",
                "• Progress toward financial goals",
                "• Target achievement rate",
                "",
                f"Insurance Coverage: {int(health_metrics['insurance'])}/100",
                "• Life, health, property protection",
                "• Coverage adequacy analysis",
                "",
                f"Asset Diversification: {int(health_metrics['diversification'])}/100",
                "• Portfolio balance assessment",
                "• Risk distribution analysis",
                "",
                f"Estate Planning: {int(health_metrics['estate_planning'])}/100",
                "• Will, solicitor, power of attorney",
                "• Legal documentation status"
            ]
        )
        
        c.showPage()
        
        # PAGE 3: Detailed recommendations
        self._create_half_page_colored_section(
            c, page_width, page_height, self.brand_pink,
            "02", "RECOMMENDATIONS",
            [
                "Priority Actions:",
                "• Build emergency fund to 6 months",
                "• Review insurance coverage gaps",
                "• Complete will and estate planning",
                "• Diversify investment portfolio",
                "",
                "Next Steps:",
                "• Schedule solicitor consultation",
                "• Update power of attorney",
                "• Review milestone timelines",
                "• Optimize asset allocation"
            ]
        )
        
        # Add traffic light indicators on white side
        c.setFillColor(self.dark_text)
        c.setFont('Helvetica-Bold', 18)
        c.drawString(page_width/2 + 40, page_height - 100, 'TRAFFIC LIGHT ASSESSMENT')
        
        y_pos = page_height - 150
        metrics = [
            ('Emergency Fund', health_metrics['emergency_fund']),
            ('Expense Control', health_metrics['expense_ratio']),
            ('Milestone Progress', health_metrics['milestones']),
            ('Insurance', health_metrics['insurance']),
            ('Diversification', health_metrics['diversification']),
            ('Estate Planning', health_metrics['estate_planning'])
        ]
        
        for metric_name, score in metrics:
            # Draw traffic light circle
            traffic_color = self._get_traffic_light_color(score)
            c.setFillColor(traffic_color)
            c.circle(page_width/2 + 50, y_pos, 8, fill=1, stroke=0)
            
            # Draw metric text
            c.setFillColor(self.dark_text)
            c.setFont('Helvetica', 12)
            c.drawString(page_width/2 + 70, y_pos - 3, f'{metric_name}: {int(score)}/100')
            
            y_pos -= 30
        
        c.showPage()
        c.save()
        buffer.seek(0)
        return buffer.read()
    
    def generate_estate_planning_report(self, user_data: Dict[str, Any], financial_data: Dict[str, Any]) -> bytes:
        """Generate estate planning report with stunning design"""
        buffer = io.BytesIO()
        
        from reportlab.pdfgen import canvas
        c = canvas.Canvas(buffer, pagesize=A4)
        
        page_width = A4[0]
        page_height = A4[1]
        
        # Cover page
        c.setFillColor(self.primary_black)
        c.rect(0, page_height/3, page_width, page_height*2/3, fill=1, stroke=0)
        
        c.setFont('Helvetica-Bold', 48)
        c.setFillColor(colors.white)
        c.drawString(60, page_height - 120, 'ESTATE')
        c.drawString(60, page_height - 180, 'PLANNING')
        
        net_worth = financial_data.get('net_worth', 0)
        potential_tax = max(0, (net_worth - 325000) * 0.4)
        
        c.setFont('Helvetica-Bold', 24)
        c.drawString(60, page_height - 250, f'Estate Value: £{net_worth:,.0f}')
        c.setFont('Helvetica', 16)
        c.drawString(60, page_height - 280, f'Potential Tax: £{potential_tax:,.0f}')
        
        # Brand section
        c.setFillColor(self.brand_pink)
        c.rect(0, 0, page_width, 80, fill=1, stroke=0)
        
        c.setFont('Helvetica-Bold', 16)
        c.setFillColor(colors.white)
        c.drawString(60, 40, 'WEALTHTRACKER PRO')
        
        c.showPage()
        
        # Estate planning strategies
        self._create_full_page_colored_section(
            c, page_width, page_height, self.primary_black,
            "01", "TAX PLANNING",
            [
                "Current Position:",
                f"• Estate Value: £{net_worth:,.0f}",
                f"• Tax-Free Allowance: £325,000",
                f"• Taxable Amount: £{max(0, net_worth - 325000):,.0f}",
                f"• Potential Tax (40%): £{potential_tax:,.0f}",
                "",
                "Optimization Strategies:",
                "• Annual gifting allowance (£3,000)",
                "• Spouse exemption utilization",
                "• Trust structures for tax efficiency",
                "• Business property relief options",
                "• Charitable giving benefits"
            ]
        )
        
        c.showPage()
        c.save()
        buffer.seek(0)
        return buffer.read()