export type CommissionerLevel = 'bronze' | 'silver' | 'gold';

interface CommissionRate {
    direct: number;   // Percentage of project value (0.0 to 1.0)
    override: number; // Percentage of project value for parent (0.0 to 1.0)
}

export const COMMISSION_RATES: Record<CommissionerLevel, CommissionRate> = {
    bronze: { direct: 0.25, override: 0.00 },
    silver: { direct: 0.25, override: 0.02 },
    gold: { direct: 0.30, override: 0.05 },
};

export const HARD_CAP_PERCENT = 0.35; // Maximum total commission payout

interface PayoutResult {
    directAmount: number;
    overrideAmount: number;
    totalPayout: number;
    isCapped: boolean;
    agencyNet: number;
}

/**
 * Calculates the commission payouts for a completed project.
 * 
 * @param projectValue Total value of the project (e.g., KES 100,000)
 * @param commissionerLevel The level of the direct commissioner
 * @param hasParent Whether the commissioner has a valid parent/referrer
 * @returns Breakdown of payouts
 */
export function calculatePayouts(
    projectValue: number,
    commissionerLevel: CommissionerLevel,
    hasParent: boolean
): PayoutResult {
    const rates = COMMISSION_RATES[commissionerLevel];

    // 1. Calculate ideal payouts
    const rawDirect = projectValue * rates.direct;
    const rawOverride = hasParent ? (projectValue * rates.override) : 0;

    let directAmount = rawDirect;
    let overrideAmount = rawOverride;

    // 2. Check Hard Cap
    const totalProposed = directAmount + overrideAmount;
    const maxAllowed = projectValue * HARD_CAP_PERCENT;
    const isCapped = totalProposed > maxAllowed;

    if (isCapped) {
        // Option A: Pro-rate both? 
        // Option B: Reduce Override first?
        // User Spec: "Total commissions cannot exceed 35%". 
        // Let's scale them down proportionally to fit the cap.
        const scale = maxAllowed / totalProposed;
        directAmount = Math.floor(rawDirect * scale);
        overrideAmount = Math.floor(rawOverride * scale);
    }

    return {
        directAmount,
        overrideAmount,
        totalPayout: directAmount + overrideAmount,
        isCapped,
        agencyNet: projectValue - (directAmount + overrideAmount)
    };
}

export function getLevelBadgeRaw(level: CommissionerLevel) {
    switch (level) {
        case 'gold': return { label: 'Gold Partner', color: 'bg-yellow-100 text-yellow-800' };
        case 'silver': return { label: 'Silver Agent', color: 'bg-gray-100 text-gray-800' };
        default: return { label: 'Bronze Scout', color: 'bg-orange-50 text-orange-800' };
    }
}
