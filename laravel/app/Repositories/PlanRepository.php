<?php

namespace App\Repositories;

use Illuminate\Http\Request;

class PlanRepository extends AbstractRepository
{
    /**
     * getPlans
     *
     * @param  mixed $formInput
     * @return void
     */
    public function getPlans($formInput) {
        return \App\Models\Plan::where('months', $formInput['months'])->where('ltd', 0)->where('is_active', $formInput['is_active'])->get();
    }

    /**
     * getPlan
     *
     * @param  mixed $plan_id
     * @return object
     */
    public function getPlan($plan_id) {
        return \App\Models\Plan::where('id', $plan_id)->where('is_active', 1)->first();
    }

    /**
     * getPlanByPrice
     *
     * @param  mixed $stripe_price_id
     * @return object
     */
    public static function getPlanByPrice($stripe_price_id) {
        return \App\Models\Plan::where('stripe_price_id', $stripe_price_id)->where('is_active', 1)->first();
    }

    /**
     * getPlanByID
     *
     * @param  mixed $id
     * @return object
     */
    public static function getPlanByID($id) {
        return \App\Models\Plan::where('id', $id)->where('is_active', 1)->first();
    }

    /**
     * trialDays
     *
     * @return void
     */
    public static function getTrialsDays() {
        return 14;
    }
}
